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