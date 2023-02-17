FROM gitpod/workspace-node:latest

# Update system
RUN sudo apt update && sudo apt upgrade -y

# install-packages is a wrapper for `apt` that helps skip a few commands in the docker env.
RUN sudo install-packages mysql-client

# Setup Yarn
RUN corepack enable
RUN corepack prepare yarn@stable --activate

# Install planetscale-cli
RUN wget https://github.com/planetscale/cli/releases/download/v0.129.0/pscale_0.129.0_linux_amd64.deb
RUN sudo dpkg -i pscale_0.129.0_linux_amd64.deb
RUN rm -rf pscale_0.129.0_linux_amd64.deb
RUN mkdir -p /home/gitpod/.config/planetscale

# Setup ZSH with Oh-My-Zsh
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" -- \
  -t https://github.com/denysdovhan/spaceship-prompt \
  -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
  -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
  -p git -p ssh-agent -p yarn \
  -p https://github.com/zsh-users/zsh-autosuggestions \
  -p https://github.com/zsh-users/zsh-completions \
  -p https://github.com/zdharma-continuum/fast-syntax-highlighting


ENV SHELL=/usr/bin/zsh