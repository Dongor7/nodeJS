/**
 * Enter 'npm start' in terminal to start the script.
 */

const axios  = require('axios');
const fs     = require('fs');
const os     = require("os");
const logger = require('./logger');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const urlsFileName   = process.argv[2];
const resultFileName = process.argv[3];

const urls = fs.readFileSync(urlsFileName, 'utf8').split(os.EOL);
const path = "https://www.googleapis.com/pagespeedonline/v4/runPagespeed";

/**
 * Check internet connection
 */
require('dns').resolve('www.google.com', function(err) {
    if (err) {
        logger.warn('Internet connection is lost!');
        logger.warn('Some requests failed. See logs: ./combine.log');
    } else {
        logger.warn('Internet connection is stable!');
    }
});


urls.forEach((url, i) => {

    setTimeout(() => {

        doRequest(url)
            .then(response => {
                let result = `${url} | score - ${response.data.ruleGroups.SPEED.score}\n`;
                logger.info(`Request to url(${url}) successfully completed.`);
                fs.appendFile(resultFileName, result, (err) => {
                    if (err) logger.error(`The result wasn't recorded`);
                });
            })
            .catch(err => err);

    }, i * 100);

});


function doRequest(url, redirectCount) {

    let count = redirectCount | 0;

    if(redirectCount >= 1) {
        logger.warn(`${url} redirected too many times.`);
        throw new Error('Redirected too many times.')
    }

    return axios
        .get(path, {
            params : {
                key: 'AIzaSyDz_sV2gEeedbSpkVakYlwYzkyGYBl9ZRA',
                url: url,
                strategy: 'desktop'
            }
        })
        .catch(error => {
            logger.error(`Request failed with status code ${error.response.status} : ${error.response.statusText}`);
            return doRequest(url, ++count);
        })
}




