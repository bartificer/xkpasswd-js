# XKPasswdJS — The Official JavaScript Port of Crypt::HSXKPasswd

[Bart Busschots](https://www.bartb.ie/) created the [Crypt::HSXKPasswd](https://metacpan.org/pod/Crypt::HSXKPasswd) Perl module to be a liberally licensed ([2-clause BSD](https://opensource.org/licenses/BSD-2-Clause)) password generator for producing secure but memorable passwords using the word-based approach made famous by the [*Correct Horse Battery Staple* XKCD comic](https://xkcd.com/936/).

![To anyone who understands information theory and security and is in an infuriating argument with someone who does not (possibly involving mixed case), I sincerely apologize.](https://imgs.xkcd.com/comics/password_strength.png)
 
Bart is leading this port of the Perl module to JavaScript with the [NosillaCast community](https://podfeet.com/slack) as part of the on-going Programming By Stealth blog/podcast series](https://pbs.bartificer.net) he produces with [Allison Sheridan](https://www.podfeet.com/blog/about/).

## Project Plan

The plan is to develop this port in the following broad stages:

1. **Project Skeleton** — project infrastructure and specification for direct port
   * Bart will work mostly solo with only typo-like pull requests accepted
   * Outcomes:
     * ULM Class Diagram defining the API for the direct port
     * Contribution guides for developers including a project code style, a Git branching policy, and a style guide for Git commits
     * Configuration files for the project tooling, specically WebPack (bundler), JSLint (code linter), JSDoc (documentation generator), and Jest (test suite)
     * Automations/Scripts to build the project, run the test suite, and build the documentation
2. **Direct Port** — implementation of a feature-for-feature port of the Perl module to JavaScript
   * Pull requests implementing the documented design and following the contribution guidelines will be gratefully accepted
   * The issue tracker will be opened and used to track bugs and enhancement requests
   * Outcomes:
     * An ES6 JavaScript module implementing the documented API
     * Detailed documentation
     * A Jest test suite with full code coverage
     * An officual NPM package for the module
3. **Maintenance & Enhancement** — bug fixes, security patches, and feature enhancements
   * Details to be agreed later based on the experiences from phase 2.

**The project is currently in phase 1 — project skeleton**.
