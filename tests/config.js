import {readConfig, editConfig, createConfig} from "../utils/config.js";

let data =
    {
        data: 1,
        test: 'tset'
    }
await createConfig('test', data)
