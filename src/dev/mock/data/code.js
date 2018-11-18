export default {
  "blocks": [
    {
      "key": "btr39",
      "text": "По-другому, или правильно? Как правильно, я в общем-то сказал: прочитать внимательно документацию к API платежного сервиса, там все необходимое написано, и выполнить как там сказано. ",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "2dslb",
      "text": "Я даже документацию скачал и посмотрел.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "biq4r",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "c1eu2",
      "text": ">>> Далее в зависимости от указанной версии протокола (wsb_version), считается MD5 (если версия не указана), либо SHA1 (для версии 2) объединенной строки. Пример формирования электронной подписи (на языке PHP):",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "54jt0",
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 0
        }
      ],
      "data": {}
    },
    {
      "key": "dg5rl",
      "text": "Это делается все на стороне сервера.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "4lbb8",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ],
  "entityMap": {
    "0": {
      "type": "TOKEN",
      "mutability": "IMMUTABLE",
      "data": {
        "content": "$wsb_seed = 1242649174;\n$wsb_storeid = 11111111;\n$wsb_order_num = “ORDER-12345678”;\n$wsb_test = 1;\n$wsb_currency_id = “BYN”;\n$wsb_total = 21.95;\n$SecretKey = “12345678901234567890”;\n//Значение объединенной строки: 124264917411111111ORDER-123456781BYN21.9512345678901234567890\n// для версии протокола 2 (wsb_version = 2)\n$wsb_signature = sha1($wsb_seed.$wsb_storeid.$wsb_order_num.$wsb_test.$wsb_currency_id.$wsb_total.\n$SecretKey); // 912702512e447846add6fa4985c7a2f271de52e6\n// если версия не указана\n$wsb_signature = md5($wsb_seed.$wsb_storeid.$wsb_order_num.$wsb_test.$wsb_currency_id.$wsb_total.\n$SecretKey); // 94993a8063f8ee3c205fe555f8f46319",
        "lang": "php"
      }
    }
  }
}