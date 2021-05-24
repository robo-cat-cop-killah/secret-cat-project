const jestUtils = require('jest-util');
const axios = require('axios');
const fs = require('fs');


class AsmatorReporter {

        constructor(globalConfig, options = {}) {
            this._globalConfig = globalConfig;
        }

        onRunStart() {

        }

        gobbleUpData(dir) {
            let raw = fs.readFileSync( dir + "/cdp.json");
            let json = JSON.parse(raw);
            return json; 
        }

        onRunComplete(test, results) {

            var endTime = new Date().getTime();
            var steps_data = [];
            var jid = process.env.NOMAD_ALLOC_ID;
            var geoloc = process.env.NOMAD_META_GEOLOC;
            var agent_name = process.env.NOMAD_NODE_NAME;
            
            var agent_id = process.env.NOMAD_IDENTIFIER;
            
            var resultsPath = process.env.ASMA_RESULTS_DIR;

            var jid = process.env.NOMAD_ALLOC_ID;

            var alloc_dir = process.env.NOMAD_ALLOC_DIR;

            var outputDir = resultsPath + jid;

            var outputFilePath = resultsPath + jid + "/result.json";

            var j = this.gobbleUpData(outputDir);

            var result = {};
          
            var out = {
                "step-count" : results.numTotalTests,
                "passed" : results.numPassedTests, 
                "failed" : results.numFailedTests,
                "start-time" : results.startTime,
                "events" : j.events
            }

            out.success = ( out.failed > 0 ) ? false : true;

            var steps = []; var index = 0; var subIndex = 0; var offset = 0; var errorIndex = 0;
            for (index = 0; index < results.testResults.length; index++) { 
                   for(subIndex = 0; subIndex < results.testResults[index].testResults.length;subIndex++) {
                        var step = {}; 
                        step.title =results.testResults[index].testResults[subIndex].fullName; 
                        step.duration =results.testResults[index].testResults[subIndex].duration; 
                        step.startTime =results.testResults[index].perfStats.start + offset; 
                        step.endTime =step.startTime + results.testResults[index].testResults[subIndex].duration;
                        var stepFailures = []; for ( errorIndex = 0; errorIndex < results.testResults[index].testResults[subIndex].failureMessages.length;
                        errorIndex++) {
                            stepFailures.push(results.testResults[index].testResults[subIndex].failureMessages[errorIndex]);    
                        }
                        step.failures = stepFailures; steps.push(step); offset += step.duration; 
                    }
            }

            result.returncode = ( out.success ) ? 0 : 1;
            process.env.ASMA_EXIT_CODE = result.returncode;

            result.stdout = "";
            result.stderr = "";
            result.start_timestamp_ms = results.startTime;
            result.end_timestamp_ms = endTime;
            result.message = "" + results.numTotalTests + " steps";
            result.unit = "ms";
            result.value = results.duration;
            
            out.steps = steps;

            result.test_result = out;

            var root ={ "result": JSON.stringify(result)}
            root.script = "jest";
            root.check_guid = "2983332e-0e57-43df-a81b-179318e11aa0";
            root.timeout = 60000;
            root.user = agent_id;
            root.geoloc = geoloc;
            root.job_id = jid;
            root.worker = geoloc;
            root.severity = "I";
            root.customer_guid = "2983332e-0e57-43df-a81b-179318e11aa0"; 
            root.attempts = 1;
            root.message = results.numTotalTests;
            root.agent_name = agent_id;
            root.agent_id = agent_id;  
            root.silo = 1;

            /* Send result to result service */
            axios.defaults.headers = { "x-api-key" : "aXmkWeaGRu3WrF2pKfNqx6KKUYqlJcBm2RX5UW47", "Content-Type":"application/json"};

            axios.post('https://c0saaqo745.execute-api.eu-north-1.amazonaws.com/result-ingest-beta/ingest/runbin',root)
            .then(res => {
                    console.log(res);
            })
            .catch(error => {
                    console.error(error)
            })  



        }


}

module.exports = AsmatorReporter;
