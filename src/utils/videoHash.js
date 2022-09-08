import SparkMD5 from "spark-md5"
const spark = new SparkMD5.ArrayBuffer()
const reader = new FileReader()
//文件阈值
const FILESIZE_THRESHOLD = 5000 * 1024 * 1024
function calculateHashSample (file) {
    const size = file.size
    let chunks = []
    return new Promise(resolve => {
        if (size >= FILESIZE_THRESHOLD) {
            chunks = largeFileHash(file)
        } else {
            chunks = [file]
        }
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = (e) => {
            spark.append(e.target.result)
            resolve(spark.end())
        }
    })
}
//大文件计算hash
function largeFileHash (file) {
    const size = file.size
    const offset = 5 * 1024 * 1024   //设置5M为一个切片
    let chunks = [file.slice(0, offset)]   //存入头部第一个切片
    let cur = offset
    while (cur < size) {
        if (cur + offset >= size) {
            //文件不足分为两个切片
            chunks.push(file.slice(cur, cur + offset))
        } else {
            const mid = cur + offset / 2
            const end = cur + offset
            chunks.push(file.slice(cur, cur + 2))
            chunks.push(file.slice(mid, mid + 2))
            chunks.push(file.slice(end - 2, end))
        }
        cur += offset
    }
    return chunks
}

//文章切片
function createFileChunk (file, size) {
    if (!file) return
    const fileChunkList = []
    let cur = 0
    while (cur < file.size) {
        fileChunkList.push({ 'chunkFile': file.slice(cur, cur + size) })
        cur += size
    }
    return fileChunkList
}
//构建上传列表
function formatterChunkList (fileChunkList) {
    const requestList = []
    fileChunkList.map(({ hashPath, chunkFile, chunkIndex }) => {
        const formData = new FormData()
        formData.append('hashPath', hashPath)
        formData.append('chunkFile', chunkFile)
        formData.append('chunkIndex', chunkIndex)
        requestList.push(formData)
    })
    return requestList
}
export {
    calculateHashSample,
    createFileChunk,
    formatterChunkList
}