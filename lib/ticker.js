const _ = require('underscore');
const rp = require('request-promise');

const Ticker = {
    'tokens': (options) => {
        const tokenOptions = {
            method: 'GET',
            uri: options.url + 'cryptocurrency/map',
            qs: {
                start: 1,
                limit: 5000
            },
            headers: { 'X-CMC_PRO_API_KEY': options.key },
            json: true,
            gzip: true
        };

        return rp(tokenOptions).then(
            response => {
                let tokens = {};
                if (response.status.error_code === 0) {
                    _.each(
                        response.data,
                        token => {
                            if (token.is_active === 1) {
                                return tokens[token.symbol.toLowerCase()] = {
                                    'id': token.id,
                                    'name': token.name.toLowerCase(),
                                    'symbol': token.symbol.toLowerCase(),
                                    'slug': token.slug,
                                    'is_active': token.is_active,
                                    'platform': token.platform
                                }
                            } else { return; }
                        }
                    );
                    return tokens;
                } else {
                    console.log(response.status.error_code, response.status.error_message)
                }
            }
        );
    },
    'getTicker': (message, symbol, tokens, options) => {

        const tokenSymbol = symbol.toLowerCase();
        const validToken = _.has(tokens, tokenSymbol.toLowerCase());
        if (validToken) {
            const tokenId = tokens[tokenSymbol].id;

            const tickerOptions = {
                method: 'GET', json: true, gzip: true,
                uri: options.url + 'cryptocurrency/quotes/latest',
                qs: { 'id': tokenId, 'convert': 'USD' },
                headers: { 'X-CMC_PRO_API_KEY': options.key }
            }
            return rp(tickerOptions).then(
                response => {
                    if (response.status.error_code === 0) {
                        
                        let price = '' + response.data[tokenId].quote.USD.price;
                        const priceSplit = price.split('.');
                        price = priceSplit[0] + '.' + priceSplit[1].substr(0,2);
                        
                        let change1h = '' + response.data[tokenId].quote.USD.percent_change_1h;
                        const change1hSplit = change1h.split('.');
                        change1h = change1hSplit[0] + '.' + change1hSplit[1].substr(0,2);
                        
                        let change24h = '' + response.data[tokenId].quote.USD.percent_change_24h;
                        const change24hSplit = change24h.split('.');
                        change1h = change24hSplit[0] + '.' + change24hSplit[1].substr(0,2);
                        
                        let change7d = '' + response.data[tokenId].quote.USD.percent_change_7d;
                        const change7dSplit = change7d.split('.');
                        change1h = change7dSplit[0] + '.' + change7dSplit[1].substr(0,2);

                        return message.channel.send(
                            {
                                'embed': {
                                    'color': 0x0099ff,
                                    'title': tokenSymbol.toUpperCase() + ' Price',
                                    'fields': [
                                        {
                                            'name': 'Price',
                                            'value': '$' + price,
                                            'inline': true
                                        },
                                        {
                                            'name': 'Rank',
                                            'value': '' + response.data[tokenId].cmc_rank,
                                            'inline': true
                                        },
                                        {
                                            'name': '\u200b',
                                            'value': '\u200b'
                                        },
                                        {
                                            'name': '1 Hour Change',
                                            'value': change1h + '%',
                                            'inline': true
                                        },
                                        {
                                            'name': '24 Hour Change',
                                            'value': change24h + '%',
                                            'inline': true
                                        },
                                        {
                                            'name': '7 Day Change',
                                            'value': change7d + '%',
                                            'inline': true
                                        }
                                    ]
                                }
                            }
                        );
                    } else {
                        console.log(response.status.error_code, response.status.error_message)
                    }
                }
            );
        } else { return; }
    }
};

module.exports = Ticker;