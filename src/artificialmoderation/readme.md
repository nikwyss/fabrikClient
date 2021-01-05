# Instructions

This folder contains components of the artificial-moderation-intelligence. 
The components can be implemented somewhere in the app, for instance by <AssemblyListOngoing />. 

**Note** if the  the artificial-moderation-algortihm reuquires certain data, please access directly the localstorage or use prop-attributes. However, do not use mixins that are used elsewhere in the page. Multiple loadings of mixins slows down the app. Also prevent doing ajax call within this files. Instead: only access the localstorage or transmit relevant data by props. 