# gulp_project
gulp前端的自动化配置,实现css的压缩，私有前缀的自动添加，热更新，头部、底部的include,精灵图的自动合成

1.进入指定的目录下，在nodeJs的环境下，引入所需要的包（npm i）;<br />

2.执行npm run mkdir创建一个名为app的目录结构;<br />

3.先随便放个index.html.执行npm start会自动开启浏览器;<br />

4.在app目录下，放入html页面，--------任务构建开始会生成dist目录，所有资源转移到里面，gulp用于监听app文件的变化<br />
  → 静态资源分别置于css,js目录下<br />
  → common用于存放共同头部（header.html等）<br />
     在首页或其它页面引入格式  如：@@include('common/header.html', {"title": "首页","index": "active"})<br />
     active，用于高亮显示导航，所以在header.html修改格式如下：<br />
       `<li @@if(context.index==='active'){class="active"}><a href="index.html">首页 </li>`<br />
		   `<li @@if(context.news==='active'){class="active"}><a href="b_list.html">新闻 </li>`<br />   
  → img用于存放图片，里面有个文件夹 ico用于存放需要合成一张精灵图的图标(减少http请求),template.css用于获取位置，<br />
    精灵图会自动生成dist/css/sprite.css,dist/img/sprite.css需自己手动添加到html页面里面<br />
