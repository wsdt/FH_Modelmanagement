# Compiles stencil components but doesn't watch (needed e.g. for prestart-script to not block Node.js): 
# 			stencil build --dev

# Compiles stencil components and watches for changes: 
# 			stencil build --dev --watch

# Does the same as prior command but also opens the webpage and compiles it in a nice UI. 
# 			stencil build --dev --watch --server


# npm start is a custom script in package.json which builts all stencil components and then starts the Node.JS server.
npm start