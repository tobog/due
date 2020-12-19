const child_process = require('child_process');
const path = require('path');
[
    'dist/demo.html',
    'dist/youe.common.js.map',
    'dist/youe.umd.js',
    'dist/youe.umd.js.map',
    'dist/youe.umd.min.js.map',
].forEach(function(val) {
    const dir = path.join(__dirname, val);
    try {
        child_process.execSync('rmdir /s/q ' + dir);
    } catch (error) {
        console.log('error:' + dir);
    }
});
[
    'dist/demo.html',
    'dist/youe.common.js.map',
    'dist/youe.umd.js',
    'dist/youe.umd.js.map',
    'dist/youe.umd.min.js.map',
].forEach(function(val) {
    const dir = path.join(__dirname, val);
    try {
        child_process.execSync('del /q ' + dir);
    } catch (error) {
        console.log('error:' + dir);
    }
});