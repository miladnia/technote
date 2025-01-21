# Dockerfile instructions

| Instruction   | Description                                 |
| ------------- | ------------------------------------------- |
| `ADD`         | Add local or remote files and directories.  |
| `ARG`         | Use build-time variables.                   |
| `CMD`         | Specify default commands.                   |
| `COPY`        | Copy files and directories.                 |
| `ENTRYPOINT`  | Specify default executable.                 |
| `ENV`         | Set environment variables.                  |
| `EXPOSE`      | Describe which ports your application is listening on. |
| `FROM`        | Create a new build stage from a base image. |
| `HEALTHCHECK` | Check a container's health on startup.      |
| `LABEL`       | Add metadata to an image.                   |
| `MAINTAINER`  | Specify the author of an image.             |
| `ONBUILD`     | Specify instructions for when the image is used in a build. |
| `RUN`         | Execute build commands.                     |
| `SHELL`       | Set the default shell of an image.          |
| `STOPSIGNAL`  | Specify the system call signal for exiting a container. |
| `USER`        | Set user and group ID.                      |
| `VOLUME`      | Create volume mounts.                       |
| `WORKDIR`     | Change working directory.                   |


```dockerfile
FROM python:3.10-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run", "--debug"]
```

[#dockerfile][dockerfile], [#compose_quickstart][gettingstarted]

### CMD

Set default parameters for `ENTRYPOINT`:

- `CMD ["executable","param1","param2"]`
- `CMD ["param1","param2"]`

Read more: [Shell and exec form][shell_exec]

> Notice: `CMD` **doesn't** execute anything at build time.

[#dockerfile][dockerfile]

### ENTRYPOINT

```
ENTRYPOINT ["executable", "param1", "param2"]
```

- It allows you to **configure a container**.
- `docker run <image> -d` will pass the `-d` argument to the entry point.
- Override `ENTRYPOINT` using `docker run --entrypoint`.

[#dockerfile][dockerfile]

### ADD vs COPY

`ADD` supports features for fetching files from remote HTTPS and Git URLs, and extracting tar files automatically when adding files from the build context.

If you need to include files from the build context in the final _image_, use COPY. [#best_practices][best]

---

# Compose

Compose simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single, comprehensible YAML configuration file. [#compose_quickstart][gettingstarted]

More: [Awesome Compose samples][awecompose]

## Build from Dockerfile

```yaml
services:
  web:
    build: .
```

> Note: Use `docker compose up --build` to force to rebuild the image.

## Networking in Compose

By default, _Compose_ sets up a single network and each container for a service joins the network. [#networking][networking]

```yaml
services:
  web:
    build: .
    ports:
      - "8000:8000"
  db:
    image: postgres
    ports:
      - "8001:5432"
```

Each container can look up the service name `web` or `db` and get back the appropriate container's IP address.

> Note: The network is given a name based on the **project name**, which is based on _the name of the directory_. Override it with either the `--project-name` flag or the `COMPOSE_PROJECT_NAME` environment variable.

## Project name

```yaml
name: myapp

services:
  foo:
    image: busybox
    command: echo "I'm running ${COMPOSE_PROJECT_NAME}"
```

[#version_name][vername], [#project_name][proname]

---

# Best practices

### Don't install unnecessary packages

Avoid installing extra or unnecessary packages just because they might be nice to have. For example, you don’t need to include a text editor in a database image.

When you avoid installing extra or unnecessary packages, your images have reduced complexity, reduced dependencies, reduced file sizes, and reduced build times.

### Decouple applications

Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers. For instance, a web application stack might consist of three separate containers, each with its own unique image, to manage **the web application**, **database**, and **an in-memory cache** in a decoupled manner.

Use your best judgment to keep containers as clean and modular as possible. If containers depend on each other, you can use [Docker container networks][network] to ensure that these containers can communicate.

### FROM

Whenever possible, use current official images as the basis for your images. Docker recommends the [Alpine image][alpine] as it is tightly controlled and small in size (currently under 6 MB), while still being a full Linux distribution.

[#best_practices][best]

---

[dockerfile]: https://docs.docker.com/reference/dockerfile/
[shell_exec]: https://docs.docker.com/reference/dockerfile/#shell-and-exec-form
[gettingstarted]: https://docs.docker.com/compose/gettingstarted/
[networking]: https://docs.docker.com/compose/how-tos/networking/
[proname]: https://docs.docker.com/compose/how-tos/project-name/
[vername]: https://docs.docker.com/reference/compose-file/version-and-name/
[comhist]: https://docs.docker.com/compose/intro/history/
[volumes]: https://docs.docker.com/engine/storage/volumes/
[bind]: https://docs.docker.com/engine/storage/bind-mounts/
[network]: https://docs.docker.com/engine/network/
[alpine]: https://hub.docker.com/_/alpine/
[best]: https://docs.docker.com/build/building/best-practices/
[mysqlentry]: https://github.com/docker-library/mysql/blob/master/8.4/docker-entrypoint.sh
[awecompose]: https://github.com/docker/awesome-compose
