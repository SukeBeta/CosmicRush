关于Food

Food  代表单个食物
Foods 代表食物的集合


Food的时间顺序：

1.由服务器定时创建新的Food
2.服务器创建后broadcast给每个客户端 新Food的（id, x, y），客户端自己随机创建颜色显示
3.Food加入客户端与服务器的Foods中，在新玩家加入时服务器将整个Foods列表发过去
4.当某个玩家覆盖到某个Food的时候，Food就被吃掉了，此时发生:
    玩家point +2
    玩家mass +2
    该Food 消失：服务器broadcast Food的ID，每个客户端调用这个Food的remove()，之后从Foods里删除
    该Food 从服务器的Foods里删除