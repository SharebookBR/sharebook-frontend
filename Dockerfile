# base image
FROM node:14

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    apt-get update --allow-releaseinfo-change && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
RUN npm install -g @angular/cli@13.3

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0
