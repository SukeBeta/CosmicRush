关于Dot

dot  代表单个食物
dots 代表食物的集合


Dot的时间顺序：

1.由服务器定时创建新的Dot
2.服务器创建后broadcast给每个客户端 新Dot的（id, x, y），客户端自己随机创建颜色显示
3.dot加入客户端与服务器的dots中，在新玩家加入时服务器将整个dots列表发过去
4.当某个玩家覆盖到某个dot的时候，dot就被吃掉了，此时发生:
    dot.kill()
    玩家point +1
    玩家mass +1
    该dot 消失：服务器broadcast dot的ID，每个客户端:
        从dots中找出dot
        dots.remove(dot)
        dot.destroy()
    该dot 从服务器的dots里删除