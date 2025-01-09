# XKPasswd Repo Re-organisation — January 2025



## Initial State

Before this re-organisation the following repositories exist:

1. [bartificer/www.xkpasswd.net](https://github.com/bartificer/www.xkpasswd.net) — the repo holding the code for the old Perl-based website
   * No website hosted from this repo
   * Code entirely legacy
2. [bartificer/xkpasswd-userguide](https://github.com/bartificer/xkpasswd-userguide) — a port of the generic parts of the Perl documentation
   * Currently published to [userguide.xkpasswd.net]( https://userguide.xkpasswd.net/) via GitHub Pages
3. [bartificer/xkpasswd-js](https://github.com/bartificer/xkpasswd-js) — both the JavaScript port of the old Perl module and a new web interface
   * Website currently published to [beta.xkpasswd.net](https://beta.xkpasswd.net/)



## The Problems to be Solved

The aim of the re-organisation is to address the following issues:

1. The JavaScript module currently shares a single repo with the beta website, these need to be separated so the module can be used stand-alone for other applications like a CLI client, or be easily imported into other people's JavaScript projects
2. The website needs to come out of beta
3. The JS port needs to go 1.0
4. As more ports are written, a single hub is needed as the homepage for the concept of an XKPasswd library. The hub site should:
   1. Maintain a master list of *blessed* ports (Perl, JavaScript & Elixir)
   2. Host the conceptual documentation currently branded as the user-guide
   3. Be hosted at a sensible domain, perhaps the `lib.xkpasswd.net` sub domain, or perhaps a dedicated TLD like `xkpasswdlib.org`



# Target State

After the re-organisation the repositories should be configured as follows:

1. [bartificer/www.xkpasswd.net](https://github.com/bartificer/www.xkpasswd.net)
   1. The perl-based website code saved for posterity on a legacy branch named `v1-perl-legacy`
   2. The new JavaScript version of the website on the main branch and a tracking production branch named `v2-javascript`
   3. The new JavaScript version of the website hosted from this repo using GitHub pages at `www.xkpasswd.net`
2. [bartificer/xkpasswd-userguide](https://github.com/bartificer/xkpasswd-userguide) 
   1. Host the home page for the library as a whole via GitHub Pages, i.e. an expanded version of the original user guide with a list of *blessed* ports added
   2. Moved to the chosen domain for the library as a whole
3. [bartificer/xkpasswd-js](https://github.com/bartificer/xkpasswd-js)
   * Host the JavaScript port of the module to support continued development
   * Host the API documentation for the JavaScript library using GitHub Pages on the `js.xkpasswd.net` subnet