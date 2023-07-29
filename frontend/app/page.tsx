import { Box, Button, Input } from '@kuma-ui/core'

const Page = () => {
  return <>
    <Box as="main" display="flex" flexDir={['column']}>
      <form>
        <Input placeholder="URLを入力してください" />
        <Button variant="primary">読み取り</Button>
      </form>
      <Box>
        <p>読み取り結果</p>
        <p>タイトル</p>
        <p>画像</p>
        <p>商品情報</p>
        <p>金額</p>
      </Box>
    </Box>
  </>
}

export default Page
