
const { exec } = require('child_process');
// const install = function (index = 0) {
//     exec('npm deprecate vview-tobog@1.2.'+index+' no', (err, stdout, stderr) => {
//         if (index > 100) return;
//         // exec('rd /s /q node_modules', (err, stdout, stderr) => {
//             console.log(index, err,stdout);
//             install(++index)
//             // setTimeout(function () {
//             //     install(++index)
//             // }, 300)
//         // });
      
//     });
// }


function install(index = 0) {
    exec('git pull && npm run pub', (err, stdout, stderr) => {
        if(err){
            console.log(index, err, stdout);
            install(++index)
        }else{
            console.log(stdout)
        }
    });
}
install();