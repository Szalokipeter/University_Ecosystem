Day 2
Fixed npm vulnerability for no real reason other that its existence bothered me
Customized vsc for ease of work with angular, also syncing with git profile
Set up jest for unit testing but kept jasmine and karma in case I need to test real browser behaviours like browser APIs and whatnot (window.localStorage, CanvasRenderingContext2D...)
Realized the header needs no unit testing since the only real functionality within the comonent ts will be a defferable view for the email prompt, desplaying it on an if clicked trigger. Not sure if this is at all necceserry btw I just like the idea of it and should make things load just a little bit faster, though this (considering the prompt whiel a component of its own is a mere form) will likely be a minescule change. Still fun though.

Sarted working on the actual header comp
We have a header... doing nothing for now whiel only being a line of text but hey all setup is working
Having async problems with the e2e... I think -> second describe cant seem to access variables
So global variables work a little differently than I thought. No matter we are now using cy.env for environment variables. Also had to rewrite checkInViewport a little. Onto rewriting the get logic.
