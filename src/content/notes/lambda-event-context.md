---
title: "Lambda のハンドラーには event と context が渡され、event には起動元ごとの入力、context には実行環境の情報が入る"
date: 2026-10-24
tags: [aws]
---

AWS Lambda の関数が呼び出されると、ハンドラーには `event` と `context` の2つの引数が渡される。`event` にはその呼び出しのきっかけになったイベントの情報が、`context` には呼び出しや実行環境についての情報が入っている。

```python
def lambda_handler(event, context):
    ...
```

`event` は、もとは JSON のデータで、Python なら辞書として受け取れる。中身の形は、どのサービスから呼び出されたかによって決まる。

| 起動元 | `event` に入っている主な情報 |
| --- | --- |
| API Gateway | HTTP のヘッダー、ボディ、パスパラメータ、クエリパラメータなど |
| S3 | イベントの種類、バケット名、オブジェクトのキーなど |

たとえば S3 にファイルが置かれたときに動く関数なら、次のようにしてどのファイルが置かれたかを知る。

```python
def lambda_handler(event, context):
    record = event["Records"][0]
    bucket = record["s3"]["bucket"]["name"]
    key = record["s3"]["object"]["key"]
```

呼び出されるたびに、そのときの入力に応じて処理を変えたいなら、`event` を読むことはほぼ欠かせない。起動元ごとに形が違うので、どのキーに何が入るかは AWS のドキュメントにあるサンプルで確かめるのが確実。

一方の `context` には、リクエスト ID、関数名、メモリの上限、残りの実行時間といった情報が入っている。処理の中身には関わらないので、最初のうちは使う場面は多くない。使うとすれば、次のような場面になる。

- ログにリクエスト ID（`context.aws_request_id`）を出して、どの呼び出しのログかを追えるようにする
- 残り時間（`context.get_remaining_time_in_millis()`）を見て、タイムアウトの前に処理を切り上げる

なお、`context` を使わない場合でも、Python では引数として受け取る形で書いておく。Node.js などでは、使わなければ省略して書けることもある。
