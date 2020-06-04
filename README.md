# builder_gulp-webpack-bs4

[![Generic badge](https://img.shields.io/badge/version-2.0.0-<COLOR>.svg)](https://github.com/wowxoxo/builder_gulp-webpack-bs4)

Another project with Gulp, Webpack and Bootstrap 4 grid.

## System requirements

- [Node.js v12](https://nodejs.org)

## Clone repository an init project

```Bash
git clone https://github.com/wowxoxo/builder_gulp-webpack-bs4 project_folder
cd project_folder
rm -rf .git
git init
```

## Install dependencies

### Install gulp globally

```Bash
sudp npm install gulp
```

### Install npm packages:

```Bash
cd project_folder
npm install
```

## Commands

Start the project.

```Bash
npm start
```

Build the project.

```Bash
npm run build
```

## Create custom bootstrap

### Requirements

- [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
- [Bundler](https://bundler.io/)

### Steps

1. Extract archive from /app/src/libs/bootstrap-4.0.0.zip

2. Install dependencies

   ```Bash
   cd bootstrap-4.0.0
   npm i
   ```

3. Install Ruby (with [Ruby installer](https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller) for Windows Users)

4. Install Bundler (from 'Start Command Prompt with Ruby' Console!)

   ```Bash
   gem install bundler
   ```

   OR command behind proxy:

   ```Bash
   gem install --http-proxy http://UserLastName.UserFirstName:UserPass@10.0.4.245:3128 bundler
   ```

5. Edit Gemfile (only if you're behind proxy)

   Open Gemfile, change "source 'https://rubygems.org'" to "source 'http://rubygems.org'"

6. Install Ruby dependencies

   - Open Ruby console
   - cd to folder bootstrap-4.0.0
   - run:

     ```Bash
     # cd /d D:\
     bundle install
     ```

7. Edit file variables.scss in folder app/libs

8. Copy and replace file variables.scss to app/src/libs/bootstrap-4.0.0/scss

9. Build

   Run command in Ruby console (you can do it in git bash too, but ruby console prefer):

   ```Bash
   cd app/src/libs/bootstrap-4.0.0
   npm run dist
   ```

10. Update grid for project

    Run command in Git Bash from root folder of project

    ```Bash
    gulp bsRuby
    ```

11. Done!
