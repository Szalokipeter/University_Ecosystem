# Day 2  

### ✅ Fixed npm Vulnerability  
- Resolved an npm vulnerability—no real reason other than its existence bothering me.  

### 🎨 Customized VS Code  
- Configured VS Code for easier Angular development.  
- Synced settings with my Git profile.  

### 🧪 Set Up Jest for Unit Testing  
- Installed **Jest** for unit testing.  
- Kept **Jasmine & Karma** for testing real browser behaviors (e.g., `window.localStorage`, `CanvasRenderingContext2D`).  

### 🤔 Realization: No Need for Header Unit Tests  
- The header's **only functionality** is a **deferred email prompt view** triggered by a click.  
- Not strictly necessary, but should slightly improve load performance.  
- Still fun to implement!  

### 🏗️ Started Working on the Header Component  
- We have a **header!** …doing nothing for now, just a line of text.  
- But hey, all setups are working! 🚀  

### 🐛 Debugging E2E Async Issues  
- **Second `describe` block** couldn't access variables—thought it was an async issue.  
- Turns out **global variables** work differently than expected.  
- Switched to `cy.env` for environment variables.  
- Rewrote `checkInViewport`, now onto **rewriting the get logic**!

### Have some issues since the last commit by Peti
- First as a bane of my existance, some moderate errors returned regarding the project dependencies, again @angular-devkit/build-angular pulls a package of vulnerable version. Should be an easy fix
- Tad larger issue is the project won't build, there were some issues regarding the intelisense during development of last commit so might just be missing imports and some such

### Fixed npm Vulnerability again and the startup issue also
- Needed only to updated @babel/runtime to latest
- Now this second one I don't get it just simply works now


### I get it! I finally get it, I know how to make the header now!!! It will be beautiful! Exectly the same but just like so much better!!!!!!!!!!
I may or may not have been toying around with pseudo elements the whole weekend...

# Day 4 (not really)

### Started working on header responsibility:
States done:
- 1640px base state therefore minimal changes
- 1400px
    - fixed overflow issue
    - set font sizes as global variables and reset accordingly
    - changed font size in menu -> changed btn absolute coordinates -> properly centered social imgs (To be noted is that this centering contains a -3.6px. I do not no where this 3.6px comes from but is neccessery)
    - adjusted .btn global settings
    - set 'poppin' as base font for 'p' tags (rule is to be expanded during development)
    - added some general touchups throughout header.component.css (will likely have to move some further settings around as I expand on the rules)
- 1024px
    - moved logo up above separator
    - moved some rules back a layer from 1400
    - .nav--secondary also got moved up by a 7px, no major changes overall

# Day 5
Ladies and Gentelman we have a header! The hamburger will still need some further styling but overall I'm quite happy with it.
It was quite the struggle what with the last issue #26 being quite irritating to figure out, but the fix was quite easy overall.

# Day x
So how the general layout is going to work is like so:
- All views will have a div.view--wrapper as top element
- In style.css as general style the main .view--wrapper will get the max-width: 1600px and margin: 0 auto;
- Further views/main top element will also have a .view__main--wrapper. We will have no specific rules, for this class only the lac of it. So .view--wrapper:not(.view__main--wrapper), allowing us to set as general style rule the top shifts required so the view compoents don't collide with the header. This is unnecessery in the case of view/main as we start with slidcards that start from the top almost granting a background for the header.
- This later point of giving background to the header will mean a small issue when turning to the other views as the lack of it will mean all text will blend with the page background of same color. Will likely use the same solution as for the scrolling header (sticky).