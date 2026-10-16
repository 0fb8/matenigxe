---
title: "CDK のスタック間の依存関係は、cdk synth で出る cdk.out/manifest.json を jq で読めば一覧にでき、Graphviz で図にもできる"
date: 2026-10-17
tags: [aws]
---

CDK アプリのスタック同士がどう依存しているかは、`cdk synth` を実行すると `cdk.out/` にできる `manifest.json` を見ればわかる。このファイルには、スタックごとに「先にデプロイが必要なスタック」の一覧が書かれている。そのため、jq で取り出せば好きな形で一覧にできる。DOT 形式で出力して Graphviz に渡せば、図にもできる。

`manifest.json` の `artifacts` には、スタックのほかに、アセットの情報（`〇〇.assets`）やツリー情報なども並んでいる。中身はおおよそ次の形になっている。

```json
{
  "artifacts": {
    "NetworkStack": {
      "type": "aws:cloudformation:stack",
      "dependencies": ["NetworkStack.assets"]
    },
    "AppStack": {
      "type": "aws:cloudformation:stack",
      "dependencies": ["NetworkStack", "AppStack.assets"]
    },
    "AppStack.assets": { "type": "cdk:asset-manifest" }
  }
}
```

`dependencies` には、スタックだけでなくアセットの項目も入る。そのため、`type` が `aws:cloudformation:stack` のものだけを残すように絞り込む。

```sh
cdk synth > /dev/null
jq -r '
  .artifacts as $a
  | $a | to_entries[]
  | select(.value.type == "aws:cloudformation:stack")
  | .key as $s
  | (.value.dependencies // [])[]
  | select($a[.].type == "aws:cloudformation:stack")
  | "\($s) -> \(.)"
' cdk.out/manifest.json
```

`AppStack -> NetworkStack` のように、「依存する側 -> 依存される側」の形で1行ずつ出力される。デプロイの順番は矢印と逆向きで、`NetworkStack` が先になる。

出力の形を DOT にすれば、そのまま Graphviz で図にできる。

```sh
{
  echo 'digraph cdk {'
  jq -r '
    .artifacts as $a
    | $a | to_entries[]
    | select(.value.type == "aws:cloudformation:stack")
    | .key as $s
    | (.value.dependencies // [])[]
    | select($a[.].type == "aws:cloudformation:stack")
    | "  \"\($s)\" -> \"\(.)\";"
  ' cdk.out/manifest.json
  echo '}'
} | dot -Tsvg -o deps.svg
```

Stage を使っているアプリでは、Stage ごとの内容が `cdk.out/assembly-〇〇/` の下に別の `manifest.json` として出力される。トップの `manifest.json` だけでは、その中のスタックは見えない。そういう場合は、各 `assembly-*/manifest.json` にも同じコマンドを実行する。
