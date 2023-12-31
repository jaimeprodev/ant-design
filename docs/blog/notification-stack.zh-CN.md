---
title: 灵动的 Notification
date: 2023-10-07
author: MadCcc
---

### 堆叠

在 5.10.0 中，我们为 Notification 组件引入了一个新的特性，让原本会堆满屏幕的的醒目提醒堆叠到了一起，让原本紧张感满满的组件迎来了一丝灵动：

![Image](https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZAFSQ60WMVEAAAAAAAAAAAAADrJ8AQ/original)

我们非常喜欢这个新特性，所以在 5.10.0 之后我们把它作为了 Notification 的默认行为。这个特性会带来一些观感上的改变，比如在展开状态下消息的展示顺序变为了从上到下为从新到旧，这与之前的默认行为恰好相反，但却是新的动画下的最佳顺序。<br />当然，用户可以通过 `stack: false` 来关闭这个特性并回到 5.9.x 之前的默认行为，详细请参考我们的文档。

### 特性细节

为了实现这个功能，我们调试了很久，希望把所有细节都做的尽善尽美。我们可以从一些堆叠特性的需求开始说起。

- 堆叠的默认触发阈值是**三个以上**的 Notification 同时出现，也就是说当第四个 Notification 出现时，整个 Notification 组就会呈现收起的状态。这个阈值可以通过 `stack: { threshold: 3 }` 来调整。
- 收起状态时藏在背后可见的 Notification 是**两个**，并且我们为其增加了毛玻璃背景，更加淡化他们的存在。值得一提的是我们同样为暗色模式优化了这个效果，大家可以点击右下角切换主题来试一试。
- 收起时所有未被展示的 Notification 并没有消失，使用鼠标悬浮在收起的 Notification 组上时，会使所有没有自动关闭的 Notification 展开并按顺序排列，同时所有 Notificaiton 的持续时间将会刷新。
- 在不同的 `placement` 下收起的方向会有差异，但仅会分为两种：向上或者向下。展开时的排列顺序也会是从上到下或者从下到上两种顺序。

### 实现细节

#### 动态高度

细心的你可能发现了，随着 Notification 高度的变化，背后隐藏的消息一直都是贴着最新的消息下方的，不会有越界的情况出现。是的，在收起状态下，所有的消息框都被限制与最新的消息等高，这会带来几个好处：

1. 我们不用担心在新消息高度太小时背后的消息有超出的情况；
2. 只需要给定一个固定的偏移量，我们就可以得出背后两个消息框的位置与宽度，从而得到一个看起来很顺畅的动画效果。

![image.png](https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*GmNORZEAwiUAAAAAAAAAAAAADrJ8AQ/original)

当然也不是只要将高度直接相等就结束了，别忘了我们的 Notification 是支持展开的，在展开时所有的消息框都应该恢复到他原本的大小，并且由原本的高度来计算展开时的偏移量。但是宽高都已经被修改了，我们需要如何还原呢？为了实现这个新特性，我们在原本的消息框外层新增了一层 div，作为消息框的容器，来承担尺寸变化的职责。而原本的消息框则只保留了内容部分，保证自身的高度不受容器的影响。而宽度则是容器由 `scaleX` 来变化，这就避免了宽度变化导致文字换行撑高容器高度的情况。在这层结构下，我们既能得到正确的内容尺寸，又可以随意修改容器的尺寸，而不影响内容的排版，一举两得。

![image.png](https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1cZGRKgxucsAAAAAAAAAAAAADrJ8AQ/original)

#### 定位方法

在定位上我们选择了最简单的方法，将所有消息框都绝对定位，展开时则是计算每一个消息框的高度，将其定位偏移量累积起来，达到目前这样流畅的动画效果。如果不考虑动画效果的话还会有其他的布局方法。比如在实现过程中我们就采用过 flex 布局，将展开时的顺序排列先实现好，然后再通过负的 `margin` 来实现堆叠效果。这同样是一种思路，但实际上会有一些动画效果上的问题：在新的消息出现时，所有下方的消息都会有一个瞬间的位移来给新消息让位。这个问题和一些其他的定位问题会融合到一起最后比较难完美解决，所以我们最终还是采用了最简单的方式——绝对定位，所有的偏移量都由我们手动计算。

### 总结

这个新特性是 antd 团队为了提升组件的灵活度与时髦度的一次尝试，希望能够带给大家更好的体验～同样因为是新的特性，如果有遇到使用问题或者 Bug 的话欢迎到 antd 的 issue 区提出。最后希望大家喜欢这个灵动的 Notification～
