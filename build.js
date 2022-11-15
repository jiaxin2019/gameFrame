let fs = require("fs");
let path = require("path");
let shell = require("shelljs");
let archiver = require('archiver');

let outputPath = path.resolve(__dirname, "./build/web-mobile");

console.log("打包开始.......")

if (!fs.existsSync(outputPath)) {
    throw new Error("cocos的构建目录必须为web-mobile");
}

let env = process.env.NODE_ENV;
let project = process.env.project;

let cdn = "//js.atguat.com.cn";

if (env != "uat") {
    cdn = "//js.gomein.net.cn";
}
//自定的zip生成的目录
let zipUrl = "../plus-m-publish-football/";

let cdncss = `${cdn}/csr/game/${project}`;
let cdnjs = `${cdn}/csr/game/${project}`;

function replaceHtml() {
    let filePath = path.resolve(__dirname, "./build/web-mobile/index.html");
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/\$\{cdn\}/gm, cdn);
    content = content.replace(/href\s*=\s*([\'\"])\/?style.css/, `href=$1${cdncss}/style.css`)
        .replace("src/polyfills.bundle.js", `${cdnjs}/src/polyfills.bundle.js`)
        .replace("src/system.bundle.js", `${cdnjs}/src/system.bundle.js`)
        .replace("src/import-map.json", `${cdnjs}/src/import-map.json`)
        .replace("./vconsole.min.js", `${cdnjs}/vconsole.min.js`)
        .replace(/System\.import\([\'\"]\.\/index.(\w+)\.js['"]\)/i, `System.import("${cdnjs}/index.$1.js")`);
    fs.writeFileSync(path.resolve(__dirname, `./dist/index.html`), content, "utf8");
}

function replaceApplication() {
    let currentDir = path.resolve(__dirname, "./build/web-mobile/");
    fs.readdirSync(currentDir, "utf8").forEach(function (name) {
        var filePath = path.join(currentDir, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && /application\.\w+\.js/.test(name)) {
            let toStr = `750, 1334, 4);
            let maDiv = document.getElementById('canvasWilMack');
            maDiv && maDiv.parentNode && maDiv.parentNode.removeChild(maDiv`;
            let content = fs.readFileSync(filePath, "utf8");
            content = content.replace(/var server\s*=\s*.+[\'\"]/, `var server = "${cdnjs}/"`)
                .replace(/var settings\s*=\s*[\'\"]src\/settings\.(\w+)\.json[\'\"]/, `var settings = server + "src/settings.$1.json"`)
                .replace(/750, 1334, 4/, toStr);
            fs.writeFileSync(path.resolve(__dirname, `./dist/${name}`), content, "utf8");
        }
    });
}

function zip(inputPath, outputPath, cb) {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    output.on('close', function () {
        console.log('压缩完成,文件大小:' + Math.round(archive.pointer() / 1024) + 'KB.');
        cb && cb();
    });

    archive.on('error', function (err) {
        throw err;
    });
    archive.pipe(output);
    archive.append(fs.createReadStream(inputPath + '/index.html'), { name: `${project}.html` });
    shell.rm("-f", "index.html");
    archive.directory(inputPath, project);
    archive.finalize();
}

function start() {
    let time = Date.now().toString().slice(0, -3);
    shell.rm("-rf", "./dist");
    shell.cp("-R", "./build/web-mobile/", "./dist");
    replaceHtml();
    replaceApplication();
    console.log("资源路径处理完成.")
    shell.mkdir("-p", "./build/package");
    zip(
        path.resolve(__dirname, "./dist"),
        path.resolve(__dirname, `./build/package/football-${time}.zip`),
        function () {
            shell.rm("-rf", "./dist");
            let path = `football-${time}.zip`;
            moveZip(path);
            console.log("打包完成.")
        }
    )
}

function moveZip(path) {
    var _src = "./build/package/" + path,
        _dst = zipUrl + path,
        readable, writable;
    console.log("zip所在的位置:" + _src);
    if (!fs.existsSync(zipUrl)) {
        console.error(zipUrl);
        console.error("转移目标路径不存在，可以暂时手动转移");
        return;
    }
    if (!fs.statSync(_src).isFile()) {
        throw new Error("要转移的目标不是文件格式");
    }
    // 判断是否为文件
    // 创建读取流
    readable = fs.createReadStream(_src);
    // 创建写入流
    writable = fs.createWriteStream(_dst);
    // 通过管道来传输流
    readable.pipe(writable);
    console.log("转移zip成功");
}

start();