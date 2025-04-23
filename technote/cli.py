import sys
import argparse
import time
import webbrowser
import socket
import threading
import subprocess

from .config import MODULE_PATH, SERVER_DEFAULT_HOST, SERVER_DEFAULT_PORT


def main():
    parser = argparse.ArgumentParser(prog="technote")
    parser.add_argument("--host", default=SERVER_DEFAULT_HOST, help=f"Host to bind (default: {SERVER_DEFAULT_HOST})")
    parser.add_argument("--port", type=int, default=SERVER_DEFAULT_PORT, help=f"Port to bind (default: {SERVER_DEFAULT_PORT})")
    parser.add_argument("--no-browser", action="store_true", help="Do not open the browser automatically")
    args = parser.parse_args()

    try:
        print("🚀 Starting the server")
        print("👉 Use Ctrl+C to stop the server")
        if args.no_browser:
            print(f"🙂 You can open http://127.0.0.1:{args.port} to access the app")
            run_server(host=args.host, port=args.port)
        else:
            print(f"🙂 If the browser doesn't open automatically, visit http://127.0.0.1:{args.port} to access the app")
            run_server_and_open_browser(host=args.host, port=args.port)
    except KeyboardInterrupt:
        print("\nShutting down the server 😴\n")
        sys.exit(0)


def run_server(host, port):
    """Run the Gunicorn server."""
    subprocess.run([
        sys.executable, "-m", "gunicorn",
        MODULE_PATH,
        "--workers", "1",
        "--threads", "2",
        "--bind", f"{host}:{port}",
    ])


def run_server_and_open_browser(host, port):
    # Since we want to open the browser, we run the server in a background thread
    server_thread = threading.Thread(
        target=run_server,
        kwargs={"host": host, "port": port},
        daemon=True
    )
    server_thread.start()

    # Wait until server is up
    for _ in range(30):  # 3 seconds max
        if is_server_up("127.0.0.1", port):
            webbrowser.open(f"http://127.0.0.1:{port}")
            break
        time.sleep(0.1)

    server_thread.join()


def is_server_up(host, port):
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False
