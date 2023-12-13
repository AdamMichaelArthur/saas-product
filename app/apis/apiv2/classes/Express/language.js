import Base from '../Base/base.js'
import btoa from 'btoa'
import atob from 'atob'
import { randomUUID } from 'crypto';
import * as util from "util";
import axios from 'axios';
import Translate from '@classes/Translate/translate.js'

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://v6.exchangerate-api.com/v6/16fb6dc664d43f1d6222bf57/latest/USD',
  headers: { }
};

let exchange_rates = {
  USD: 1,
  AED: 3.6725,
  AFN: 73.771,
  ALL: 98.4037,
  AMD: 402.8752,
  ANG: 1.79,
  AOA: 836.9087,
  ARS: 350.03,
  AUD: 1.5683,
  AWG: 1.79,
  AZN: 1.6996,
  BAM: 1.8291,
  BBD: 2,
  BDT: 110.5417,
  BGN: 1.8295,
  BHD: 0.376,
  BIF: 2830.2678,
  BMD: 1,
  BND: 1.3595,
  BOB: 6.8908,
  BRL: 4.9083,
  BSD: 1,
  BTN: 83.264,
  BWP: 13.618,
  BYN: 3.2757,
  BZD: 2,
  CAD: 1.3804,
  CDF: 2484.6329,
  CHF: 0.9021,
  CLP: 913.7262,
  CNY: 7.2923,
  COP: 4077.8175,
  CRC: 529.0292,
  CUP: 24,
  CVE: 103.1189,
  CZK: 22.9878,
  DJF: 177.721,
  DKK: 6.9748,
  DOP: 56.6211,
  DZD: 135.0147,
  EGP: 30.9099,
  ERN: 15,
  ETB: 55.9111,
  EUR: 0.9352,
  FJD: 2.2689,
  FKP: 0.8152,
  FOK: 6.9769,
  GBP: 0.8153,
  GEL: 2.6937,
  GGP: 0.8152,
  GHS: 12.0076,
  GIP: 0.8152,
  GMD: 65.4439,
  GNF: 8587.687,
  GTQ: 7.7966,
  GYD: 210.9207,
  HKD: 7.8092,
  HNL: 24.5667,
  HRK: 7.0462,
  HTG: 132.5657,
  HUF: 352.7694,
  IDR: 15698.2408,
  ILS: 3.8595,
  IMP: 0.8152,
  INR: 83.2713,
  IQD: 1308.9012,
  IRR: 41994.2194,
  ISK: 143.5065,
  JEP: 0.8152,
  JMD: 155.8858,
  JOD: 0.709,
  JPY: 151.6632,
  KES: 151.856,
  KGS: 89.3399,
  KHR: 4119.0753,
  KID: 1.5683,
  KMF: 460.0841,
  KRW: 1322.128,
  KWD: 0.3085,
  KYD: 0.8333,
  KZT: 466.1409,
  LAK: 20551.0741,
  LBP: 15000,
  LKR: 325.6472,
  LRD: 189.5145,
  LSL: 18.7155,
  LYD: 4.8688,
  MAD: 10.2113,
  MDL: 17.9527,
  MGA: 4507.1889,
  MKD: 57.5992,
  MMK: 2091.1794,
  MNT: 3473.0529,
  MOP: 8.0432,
  MRU: 39.628,
  MUR: 44.5511,
  MVR: 15.4399,
  MWK: 1682.6192,
  MXN: 17.6463,
  MYR: 4.708,
  MZN: 63.8823,
  NAD: 18.7155,
  NGN: 809.0977,
  NIO: 36.4357,
  NOK: 11.0987,
  NPR: 133.2224,
  NZD: 1.6998,
  OMR: 0.3845,
  PAB: 1,
  PEN: 3.7887,
  PGK: 3.7271,
  PHP: 56.0305,
  PKR: 287.1426,
  PLN: 4.1393,
  PYG: 7355.8738,
  QAR: 3.64,
  RON: 4.6527,
  RSD: 109.5774,
  RUB: 92.062,
  RWF: 1264.2491,
  SAR: 3.75,
  SBD: 8.421,
  SCR: 13.1389,
  SDG: 576.6894,
  SEK: 10.858,
  SGD: 1.3596,
  SHP: 0.8152,
  SLE: 22.6882,
  SLL: 22688.1741,
  SOS: 572.0105,
  SRD: 38.1159,
  SSP: 1055.1364,
  STN: 22.9122,
  SYP: 12873.2536,
  SZL: 18.7155,
  THB: 35.9862,
  TJS: 10.9427,
  TMT: 3.4999,
  TND: 3.1525,
  TOP: 2.3693,
  TRY: 28.6029,
  TTD: 6.7289,
  TVD: 1.5683,
  TWD: 32.2981,
  TZS: 2496.8802,
  UAH: 36.1638,
  UGX: 3772.1956,
  UYU: 39.7193,
  UZS: 12313.1346,
  VES: 35.3148,
  VND: 24365.8466,
  VUV: 121.0285,
  WST: 2.7415,
  XAF: 613.4454,
  XCD: 2.7,
  XDR: 0.7599,
  XOF: 613.4454,
  XPF: 111.5983,
  YER: 249.1668,
  ZAR: 18.7163,
  ZMW: 22.8974,
  ZWL: 5760.2261
}

// axios.request(config)
// .then((response) => {
  
//   exchange_rates = response.data.conversion_rates;
//   console.log(21, exchange_rates)
// })
// .catch((error) => {
//   console.log(error);
// });

let exchange_rounding_factors = {
  "USD": 1,   // U.S. Dollar (No rounding, whole numbers)
  "EUR": 1,   // Euro (No rounding, whole numbers)
  "GBP": 1,   // British Pound Sterling (No rounding, whole numbers)
  "JPY": 1,   // Japanese Yen (No rounding, whole numbers)
  "AUD": 1,   // Australian Dollar (No rounding, whole numbers)
  "CAD": 1,   // Canadian Dollar (No rounding, whole numbers)
  "CHF": 1,   // Swiss Franc (No rounding, whole numbers)
  "CNY": 1,   // Chinese Yuan Renminbi (No rounding, whole numbers)
  "INR": 1,   // Indian Rupee (No rounding, whole numbers)
  "TRY": 10,  // Turkish Lira (Rounded to the nearest 10)
  "BRL": 5,   // Brazilian Real (Rounded to the nearest 5)
  "MXN": 5,   // Mexican Peso (Rounded to the nearest 5)
  "ZAR": 10,  // South African Rand (Rounded to the nearest 10)
  "SGD": 1,   // Singapore Dollar (No rounding, whole numbers)
  "HKD": 1,   // Hong Kong Dollar (No rounding, whole numbers)
  "SEK": 1,   // Swedish Krona (No rounding, whole numbers)
  "NZD": 1,   // New Zealand Dollar (No rounding, whole numbers)
  "AED": 1,   // United Arab Emirates Dirham (No rounding, whole numbers)
  "THB": 1,   // Thai Baht (No rounding, whole numbers)
  "KRW": 1,   // South Korean Won (No rounding, whole numbers)
  "IDR": 1000, // Indonesian Rupiah (Rounded to the nearest 1000)
};

export default class Language extends Base {

    async sendPackage(req, res, responsePackage){
        var xLanguageHeaderValue = req.headers['X-language'];

        var xCurrencyValue = req.headers['x-currency'];
        
        var xRoundUp = req.headers['x-roundup'];
        if(typeof xRoundUp === 'undefined'){
            xRoundUp = false;
        } else {
            xRoundUp = true;
        }

        if(typeof xLanguageHeaderValue === 'undefined'){
            xLanguageHeaderValue = req.headers['x-language'];
        }

        if(typeof xLanguageHeaderValue === 'undefined'){
            responsePackage.language = 'en'; // English is the database language
            xLanguageHeaderValue = 'en'
        } else {
            responsePackage.language = xLanguageHeaderValue;
        }

        let google_translate = res.locals.integrations.google.translate;

        // Function to translate a value from one language to another
        function translateValue(fromLang, toLang, value) {
            // Implement your translation logic here
            // You can use external translation libraries or APIs
            // For this example, let's assume a simple translation function
            // that appends the target language code to the value
            return value + "_" + toLang;
        }

        let translationMatrix = [];

        async function iterateObject(obj, fromLang, toLang) {
            for (const key in obj) {
                if (typeof obj[key] !== 'object') {

                    let uuid = randomUUID();
                    let encoded = key;
                    let translationKeyValPair = {
                        UUID:uuid,
                        key:encoded,
                        value:obj[key]
                    }

                    obj["UUID"] = translationKeyValPair.UUID;
                    translationMatrix.push(translationKeyValPair)
                    obj[key] = translationKeyValPair;
                    
                    if(key.includes('price')){
                        if(typeof xCurrencyValue !== 'undefined'){
                            // The request has specified a currency preference.
                            let exchangeRate = exchange_rates[xCurrencyValue];
                            let priceInDefaultCurrency = obj[key].value;
                            let priceInExchangeCurrency = priceInDefaultCurrency * exchangeRate;
                           
                            var price_rounding_factor = 1;
                            if(typeof exchange_rounding_factors[xCurrencyValue] !== 'undefined'){
                                price_rounding_factor =  exchange_rounding_factors[xCurrencyValue]
                            }

                            obj[key].value = priceInExchangeCurrency
                            obj[key].value = Math.round(obj[key].value * 100) / 100;
                        }

                        if(xRoundUp == true){
                            var price_rounding_factor = 1;
                            if(typeof exchange_rounding_factors[xCurrencyValue] !== 'undefined'){
                                price_rounding_factor =  exchange_rounding_factors[xCurrencyValue]
                            }

                            //console.log(112, priceInExchangeCurrency, price_rounding_factor, Math.round(priceInExchangeCurrency / price_rounding_factor));
                            obj[key].value = Math.round(obj[key].value / price_rounding_factor) * price_rounding_factor;                            
                        }
                    }

                } else if (typeof obj[key] === 'object') {
                    await iterateObject(obj[key], fromLang, toLang);
                }
            }
        }

        async function defaultIterate(obj) {
            for (const key in obj) {
                if (typeof obj[key] !== 'object') {

                    if(key.includes('price')){
                        console.log(310, obj[key]);
                        if(typeof xCurrencyValue !== 'undefined'){
                            // The request has specified a currency preference.
                            let exchangeRate = exchange_rates[xCurrencyValue];
                            let priceInDefaultCurrency = obj[key];
                            let priceInExchangeCurrency = priceInDefaultCurrency * exchangeRate;
                           
                            var price_rounding_factor = 1;
                            if(typeof exchange_rounding_factors[xCurrencyValue] !== 'undefined'){
                                price_rounding_factor =  exchange_rounding_factors[xCurrencyValue]
                            }

                             //console.log(82, priceInDefaultCurrency, priceInExchangeCurrency, exchangeRate) 

                            obj[key] = priceInExchangeCurrency
                            obj[key] = Math.round(obj[key] * 100) / 100;
                        }

                        if(xRoundUp == true){
                            var price_rounding_factor = 1;
                            if(typeof exchange_rounding_factors[xCurrencyValue] !== 'undefined'){
                                price_rounding_factor =  exchange_rounding_factors[xCurrencyValue]
                            }

                            //console.log(112, priceInExchangeCurrency, price_rounding_factor, Math.round(priceInExchangeCurrency / price_rounding_factor));
                            obj[key] = Math.ceil(obj[key] / price_rounding_factor) * price_rounding_factor;
                            console.log(336, obj[key]);

                        }
                    }

                } else if (typeof obj[key] === 'object') {
                    await defaultIterate(obj[key]);
                }
            }
        }

        async function reconstituteObject(obj, parentObj, translationAr, topLevel =false) {

            for (const key in obj) {
                if (typeof obj[key] === 'string') {

                    //console.log(65, obj);
                    
                    //obj["Test"] = true;
                    // let replacementObj = {}
                    // replacementObj[obj['key']] = obj['value'];
                    // for(var translation of translationAr){
                    //     if(translation['UUID'] == obj['UUID']){
                    //         console.log(57, obj['key']);
                    //         if(typeof obj !== 'undefined'){
                    //             obj = replacementObj;
                    //             console.log(68, obj);
                    //         }
                    //         //process.exit(1);
                    //     }
                    // }
                } else if(typeof obj[key] === 'object') {
                    await reconstituteObject(obj[key], parentObj, translationAr, false);
                    
                    if(typeof obj[key]['value'] !== 'undefined'){
                        delete obj[key]['value']['UUID']
                        delete obj[key]['key']
                        let value = JSON.parse(JSON.stringify(obj[key]['value']))
                        delete obj['UUID']
                        
                        obj[key] = value;

                    }
                }
            }

            
        }

        // Function to check if a string looks like a URL
        function isURL(str) {
            // Regular expression pattern for detecting URLs 
            var urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})(\/[^\s]*)?$/;

            // Use the test() method to check if the string matches the URL pattern
            return urlPattern.test(str);
        }


        function isDate(str) {
            // Regular expression patterns for detecting date and time formats
            const datePatterns = [
                /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/, // ISO 8601
                /^\d{4}\/\d{2}\/\d{2}( \d{2}:\d{2}(:\d{2})?)?$/, // YYYY/MM/DD and optional HH:MM[:SS]
                /^\d{2}\/\d{2}\/\d{4}( \d{2}:\d{2}(:\d{2})?)?$/, // MM/DD/YYYY and optional HH:MM[:SS]
                /^\d{2}\.\d{2}\.\d{4}( \d{2}:\d{2}(:\d{2})?)?$/, // DD.MM.YYYY and optional HH:MM[:SS]
                /^\d{2}-\d{2}-\d{4}( \d{2}:\d{2}(:\d{2})?)?$/, // DD-MM-YYYY and optional HH:MM[:SS]
                // Add more patterns as needed to cover additional date and time formats
            ];

            // Check if the string matches any of the date patterns
            for (const pattern of datePatterns) {
                if (pattern.test(str)) {
                    return true;
                }
            }

            return false;
        }


        // Function to check if a string looks like a number
        function isNumber(str) {
            // Regular expression pattern for detecting numbers
            var numberPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;

            // Use the test() method to check if the string matches the number pattern
            return numberPattern.test(str);
        }

        // Call the recursive function to translate string values
        if(responsePackage.language != 'en'){
            console.log(430, responsePackage.language)
            await iterateObject(responsePackage, 'en', responsePackage.language); // Replace 'fromLang' and 'toLang' with actual language codes    
            let translate = new Translate();
            await translate.translate("en", xLanguageHeaderValue, translationMatrix);
            //console.log(431, translationMatrix)
            await reconstituteObject(responsePackage, responsePackage, translationMatrix, true)
            delete responsePackage['Result']['UUID']
            delete responsePackage['Result']['key']           
        } else {
            await defaultIterate(responsePackage);
        }
       
        res.status(200);
        res.json(responsePackage);
    }
}
