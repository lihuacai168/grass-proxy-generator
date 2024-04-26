<template>
  <div class="container">
    <div class="header-container">
      <h1 class="header-title">Grass代理生成器</h1>
      <span class="header-links">
      <a href="https://app.getgrass.io/register/?referralCode=9H4e0gKRCduo4J0" target="_blank">Grass注册</a>
      <a href="https://proxy-seller.com/zh/?partner=FYBX0PPYN83PPN" target="_blank">网络质量100%代理购买</a>
      <a href="https://github.com/lihuacai168/grass-proxy-generator"
         target="_blank">GitHub源码（纯前端实现，无任何后门）</a>
    </span>
    </div>

    <div class="input-group">
      <label for="grassAccount">Grass账号:</label>
      <input type="text" id="grassAccount" v-model="grassAccount" placeholder="请输入Grass账号"/>
    </div>

    <div class="input-group">
      <label for="grassPassword">Grass密码:</label>
      <input type="password" id="grassPassword" v-model="grassPassword" placeholder="请输入Grass密码"/>
    </div>

    <div class="input-group">
      <label for="proxyApiToken">Proxy seller的API token:</label>
      <input type="text" id="proxyApiToken" v-model="proxyApiToken" placeholder="请输入Proxy seller的API token"/>
    </div>

    <div class="input-group">
      <label for="proxyUsername">代理的用户名:</label>
      <input type="text" id="proxyUsername" v-model="proxyUsername"
             placeholder="请输入代理的用户名（邮件中的用户名，非登录网站用户名）"/>
    </div>

    <div class="input-group">
      <label for="proxyPassword">代理的密码:</label>
      <input type="password" id="proxyPassword" v-model="proxyPassword"
             placeholder="请输入代理的密码（邮件中的密码，非登录网站密码）"/>
    </div>

    <div class="input-group">
      <label for="proxyPort">代理的端口:</label>
      <input type="text" id="proxyPort" v-model="proxyPort" placeholder="默认端口是 50101"/>
    </div>

    <div class="buttons">
      <button @click="preview">预览</button>
      <button @click="handleDownloadAllFilesAsZip">下载完整操作文档</button>
    </div>

    <div v-if="previewContent" class="preview-section">
      <p>用户信息预览:</p>
      <textarea :value="previewContent" readonly></textarea>
    </div>
  </div>
</template>
<style>
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  margin-right: 10px;
}

/* 根据需要调整宽度，这里只是个示例 */
.input-group input {
  flex: 1;
}
</style>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const grassAccount = ref('');
    const grassPassword = ref('');
    const proxyApiToken = ref('');
    const proxyUsername = ref('');
    const proxyPassword = ref('');
    const proxyPort = ref('50101');
    const previewContent = ref('grassAccount,grassPassword,proxyInfo');


    const getIps = async (token) => {
      console.log(token);
      // const url = `https://proxy-seller.com/zh/personal/api/v1/${token}/proxy/list/`;
      const url = `/zh/personal/api/v1/${token}/proxy/list/`;
      try {
        const response = await fetch(url, {
          method: 'GET', // httpx中默认为GET，所以这里我们也使用GET
          headers: {
            'accept': 'application/json',
          }
        });

        if (!response.ok) { // 检查响应的状态码是否表示成功
          throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json(); // 解析JSON
        // 假设返回的数据结构与Python示例中相同，并且我们需要遍历'data.isp'来获取每个ip
        const ips = jsonResponse['data']['isp'].map(proxy => proxy['ip']); // 转换数据
        return ips; // 返回IP地址列表
      } catch (error) {
        console.error("Error fetching IP addresses:", error);
        // 错误处理: 根据实际需求，这里可以返回空数组或其他指示错误的响应
        return [];
      }
    };
    const preview = async () => {
      // 检查每个输入项是否为空
      if (!grassAccount.value || !grassPassword.value || !proxyApiToken.value || !proxyUsername.value || !proxyPassword.value) {
        // 如果有任何一个输入项为空，显示提示信息并退出函数，不执行后面的预览逻辑
        alert('所有字段都是必填项，请确保填写完整。');
        return; // 中止函数执行
      }
      const ips = await getIps(proxyApiToken.value);
      previewContent.value = `grassAccount,grassPassword,proxyInfo\n` + ips.map(ip => `${grassAccount.value},${grassPassword.value},${proxyUsername.value}:${proxyPassword.value}:${ip}:${proxyPort.value}`).join('\n');
    };

    const downloadCSV = () => {
      // 模拟CSV内容生成
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(previewContent.value);
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', 'tasks.csv');
      link.click();
    };


// Assumes JSZip is loaded if you're including it via a <script> tag.

    async function downloadZip() {
      if (previewContent.value === 'grassAccount,grassPassword,proxyInfo') {
        await preview();
      }
      const JSZip = require('jszip');
      const zip = new JSZip();

      // 添加CSV文件
      zip.file("tasks.csv", previewContent.value);

      // 添加docker-compose.yml文件
      const dockerComposeContent = `version: '3'
services:
  grass:
    image: rikasai/grass  # 指定远程镜像的名称
    volumes:
      - ./tasks.csv:/grass/tasks.csv

  `;
      zip.file("docker-compose.yml", dockerComposeContent);

      // 添加README.md文件
      const readmeContent = `# 一定要注意看！！！
## 安装docker和docker-compose请自行搜索

## 操作步骤，只需要一步
压缩包上传到服务器，解压，进入文件夹，然后执行这个命令即可
docker-compose up -d --build

有问题就输入，查看日志
docker-compose logs --tail 200
  `;
      zip.file("README.md", readmeContent);

      try {
        const zipBlob = await zip.generateAsync({type: "blob"});
        saveAs(zipBlob, "grass_docker_compose.zip"); // Use FileSaver.js here or implement your own method
      } catch (e) {
        console.error(e);
      }
    }

// 下载函数，这里使用 FileSaver.js 的 saveAs方法。你可以替换为自己的下载实现。
    function saveAs(blob, filename) {
      const url = window.URL.createObjectURL(blob);
      const anchorElem = document.createElement("a");
      anchorElem.style = "display: none";
      anchorElem.href = url;
      anchorElem.download = filename;
      document.body.appendChild(anchorElem);
      anchorElem.click();
      document.body.removeChild(anchorElem);
      window.URL.revokeObjectURL(url);
    }

// 拓展或替换为你的下载逻辑
    const handleDownloadAllFilesAsZip = () => {
      downloadZip();
    };

    return {
      grassAccount,
      grassPassword,
      proxyApiToken,
      proxyUsername,
      proxyPassword,
      proxyPort,
      previewContent,
      preview,
      downloadCSV,
      handleDownloadAllFilesAsZip
    };
  }
};
</script>

<style>
/* 页面和容器样式 */
.container {
  max-width: 1000px; /* 容器的最大宽度 */
  margin: 0 auto; /* 上下保持0，左右自动（居中容器） */
  padding: 20px; /* 容器内部的填充 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 给容器添加一个阴影 */
  border-radius: 8px; /* 容器边缘的圆角 */
  background-color: #fff; /* 背景颜色 */
}

/* 输入框样式 */
input {
  display: block; /* 使输入框独占一行 */
  width: 100%; /* 输入框宽度填满容器宽度 */
  padding: 10px; /* 输入框内部的填充 */
  margin: 10px 0; /* 增加上下外边距 */
  box-sizing: border-box; /* 确保宽度和填充一起计算 */
  border: 1px solid #ccc; /* 输入框边框 */
  border-radius: 5px; /* 边框圆角 */
}

/* 按钮样式 */
button {
  padding: 10px 20px; /* 增加按钮的填充，使其更大 */
  margin-right: 10px; /* 右外边距，保持按钮之间的间隔 */
  background-color: #007bff; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 移除边框 */
  cursor: pointer; /* 鼠标悬停时显示手指光标 */
  border-radius: 5px; /* 按钮边框圆角 */
}

button:hover {
  background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}

/* 预览区域样式 */
textarea {
  width: 100%; /* 宽度填满容器 */
  padding: 10px; /* 内部填充 */
  margin-top: 10px; /* 顶部外边距 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 边框圆角 */
  box-sizing: border-box; /* 确保宽度和填充一起计算 */
  height: 150px; /* 高度 */
}

h1 {
  text-align: center; /* 标题居中 */
  margin-bottom: 20px; /* 增加与下面内容的间距 */
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  margin-right: 10px;
}

/* 根据需要调整宽度，这里只是个示例 */
.input-group input {
  flex: 1;
}


.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  margin-right: 10px; /* 或者根据实际设计调整 */
}

.header-links a {
  margin-left: 10px; /* 左边距，让链接之间有间隔 */
}

/* 如果标题很长，导致链接无法在同一行显示，可以为链接添加样式来确保它们不会换行，如下 */
.header-links {
  white-space: nowrap;
  margin-left: 40px;
}
</style>