import argparse
import time
import webbrowser
import socket
import threading

from .config import SERVER_DEFAULT_HOST, SERVER_DEFAULT_PORT
from .server import run as run_server


def main():
    parser = argparse.ArgumentParser(prog="technote")
    parser.add_argument("--host", default=SERVER_DEFAULT_HOST, help=f"Host to bind (default: {SERVER_DEFAULT_HOST})")
    parser.add_argument("--port", type=int, default=SERVER_DEFAULT_PORT, help=f"Port to bind (default: {SERVER_DEFAULT_PORT})")
    parser.add_argument("--no-browser", action="store_true", help="Do not open the browser automatically")

    args = parser.parse_args()
    host = args.host
    port = args.port

    if args.no_browser:
        run_server(host=host, port=port)
    else:
        # Run the server in a background thread if we want to open browser
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
