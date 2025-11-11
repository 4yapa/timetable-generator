const { spawn } = require("child_process");

const runPython = (fileBuffer) => {
    console.log(`Received file buffer of size: ${fileBuffer.length}`);

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", ["../python-scripts/excel_Parser.py"]);

        pythonProcess.stdin.write(fileBuffer);
        pythonProcess.stdin.end();

        let data = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on("data", (error) => {
            errorData += error.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                console.error(`Error from Python script: ${errorData}`);
                reject(`Python script exited with code ${code}: ${errorData}`);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    console.error("Failed to parse JSON from Python output:", data);
                    reject("Invalid JSON returned from Python script.");
                }
            }
        });
    });
};

module.exports = { runPython };
