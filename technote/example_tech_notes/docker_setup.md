# CLI completion

 CLI completion for _Oh My Zsh_:

```shell
mkdir -p ~/.oh-my-zsh/completions
docker completion zsh > ~/.oh-my-zsh/completions/_docker
```

[#docker_completion](https://docs.docker.com/engine/cli/completion/)

# Proxy

Set proxy in the config file `/etc/docker/daemon.json`:

```
{
  "proxies": {
    "http-proxy": "http://127.0.0.1:1234",
    "https-proxy": "http://127.0.0.1:1234",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

> Use `systemctl restart docker` to restart the daemon.

[#docker_proxy](https://docs.docker.com/config/daemon/proxy/), [#docker_daemon](https://docs.docker.com/config/daemon/)
