My Personal Userscripts
=======================

This is a collection of userscripts I have created. The main purpose of this
repository is to have a place where I can store my scripts while also having
them syncted across multiple browsers / machines.

You are free to use any of the scripts here but **you do this at your own
risk**.

Even though I'm a fan of clean code, some scripts here might be super ugly
because sometimes I just want to have something right now. I apologize for
that in advance. :yum:



Hacking
-------

#### Prerequisites

- Install [Violentmonkey](https://violentmonkey.github.io/) in your favorite browser
- Install [Node.js]()



#### Edit with your favorite editor

After cloning the repo, install dependencies:

    $ npm install

Then serve the files:

    $ npm run serve

The scripts in the `scripts` directory will now be available at 
`localhost:8080`. To change the port run the command with the `-p` option:

    $ npm run serve -p 1337

to run on port `1337` for example.

Next is to navigate to http://localhost:8080/ and select the userscript
you want to edit. In the Violentmonkey "Installing script" window click the
`Options` button in the top right and select "*Track local files before this
window is closed*". Then press the "*Confirm installation*" button and leave
the window open.

As soon as you make changes to a script using your local editor, the script
will be refreshed in Violentmnokey.



Contributing
------------

Have some cool ide? Feel free to fork and send me a pull request. If it fits my
needs, I will eventually merge it in. And of course I'll mention you here :wink:
