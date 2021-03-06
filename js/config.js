var LAYOUT = {
    init_menu_width_percent: 20
}
var user = {
    github: {
        name: "zhaozuodong",
        data_repo: "notes",
        data_root_path: "/",
        data_recursive: 10,
        project_repo:"zhaozuodong.github.io"
    }
}
var GITHUB_API = {
    url: {
        contents: `https://api.github.com/repos/${user.github.name}/${user.github.data_repo}/contents`
    },
    methods: {
        rootUrl: function (root) {
            if(!root){
                root=user.github.data_root_path
            }
            root=root.replace(/^\//,"")
            var url;
            if(!root){
                $.ajax({
                    url: `https://api.github.com/repos/${user.github.name}/${user.github.data_repo}/branches/master`,
                    async: false,
                    success: function (data) {
                        url=`https://api.github.com/repos/${user.github.name}/${user.github.data_repo}/git/trees/${data.commit.sha}?recursive=10`
                    }
                });
            }else{
                var parent=root.indexOf("/")>-1?root.replace(/\/[^\/]+$/,""):""
                $.ajax({
                    url: `https://api.github.com/repos/${user.github.name}/${user.github.data_repo}/contents/${parent}`,
                    async: false,
                    success: function (data) {
                        $.each(data,function(i,file){
                            if(file.type=="dir"&&file.path==root){
                                url=`${file.git_url}?recursive=10`
                            }
                        })
                    }
                });
            }
            return url;
        },
        projectReadme:function(callback){
            $.ajax({
                url: `https://api.github.com/repos/${user.github.name}/${user.github.project_repo}/branches/master`,
                async: false,
                success: function (data) {
                    $.get(`https://api.github.com/repos/${user.github.name}/${user.github.project_repo}/git/trees/${data.commit.sha}`,function(data){
                        $.each(data["tree"],function(i,d){
                            if(d["path"]=="README.md"){
                                callback(d)
                            }
                        })
                    })
                }
            });
        }
    }
}