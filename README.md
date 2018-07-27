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
`localhost:1337`.

If you need to change the port, you can do so using the environment variable
`$USERSCRIPTS_PORT`:

    $ USERSCRIPTS_PORT=1337 npm run serve

Change the `1337` to anything you like.

Next is to navigate to http://localhost:1337/ and select the userscript
you want to edit. In the Violentmonkey "Installing script" window click the
`Options` button in the top right and select "*Track local files before this
window is closed*". Then press the "*Confirm installation*" button and leave
the window open.

Make sure you are on `localhost`, not `127.0.0.1`. Violentmonkey will poll for
script changes only when on `localhost`.

As soon as you make changes to a script using your local editor, the script
will be refreshed in Violentmnokey.



Contributing
------------

Have some cool ide? Feel free to fork and send me a pull request. If it fits my
needs, I will eventually merge it in. And of course I'll mention you here :wink:
