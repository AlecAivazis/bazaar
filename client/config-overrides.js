var injectBabelPlugin = require('react-app-rewired').injectBabelPlugin
var configEnv = require('dotenv').config

// load environment variables
configEnv()

module.exports = function override(config, env) {
    // add the relay plugin
    let innerConfig = injectBabelPlugin('relay', config)
    // add the lodash plugin
    innerConfig = injectBabelPlugin('lodash', config)
    // tranform process variables to the client
    innerConfig = injectBabelPlugin(
        [
            'transform-define',
            Object.keys(process.env).reduce(
                (prev, key) => ({
                    ...prev,
                    [`process.env.${key}`]: process.env[key]
                }),
                {}
            )
        ],
        config
    )
    // add the stage-0 preset
    innerConfig.module.rules[1].oneOf[1].options.presets.push('stage-0')

    // return the modified configuration
    return innerConfig
}
