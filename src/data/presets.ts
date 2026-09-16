import { OutlineData, YanYanLead, ChapterSection } from '../types';
import { TUOXIE_PRESET } from './tuoxiePreset';

export interface PresetIdea {
  id: string;
  title: string;
  badge: string;
  emotion: '反转震撼' | '爽感释放' | '意难平' | '细思极恐' | '治愈温暖' | '共鸣感动';
  premise: string;
  fullOutline: OutlineData;
  lead: YanYanLead;
  chapters: ChapterSection[];
}

export const PRESET_IDEAS: PresetIdea[] = [
  TUOXIE_PRESET,
  {
    id: 'waimai',
    title: '超时外卖',
    badge: '悬疑·反转震撼',
    emotion: '反转震撼',
    premise: '外卖员发现自己每天少一小时，而超时的订单会死人。',
    fullOutline: {
      title: '超时外卖',
      params: {
        form: 'novel',
        targetLength: '10000字',
        targetEmotion: '反转震撼',
        genre: '悬疑怪谈',
        pov: '第一人称「我」',
        endingTone: '反转',
        strategy: '戏剧性反讽（读者交底）',
        premise: '外卖员发现自己每天少一小时，而超时的订单会死人。'
      },
      logline: '负债累累的深夜外卖员发现送餐软件吞噬自己的生理时间，超时订单的用户在当晚离奇死亡，当他决定违规拒接时，下一单收件人变成了他自己。',
      storyContract: {
        goal: '找出订单与死亡的真相，在生理时间耗尽前破解死局活着摆脱平台。',
        obstacle: '神秘派单系统的抹杀惩罚与不知情的警官怀疑他是连环凶手。',
        engine: '一旦拒单或逃跑，倒计时瞬间清零；且每一单的配送时间都比上一单少五分钟。',
        changePerRound: '从被动为钱卖命到发现受害者名单是自己曾间接伤害的人，权力关系彻底倒转。',
        finalOutcome: '揭晓系统是他濒死时的潜意识忏悔模拟器，最终他主动选择了替最后一个无辜者送达并付出了代价。',
        theme: '罪愆不会因为遗忘而消失，偿还是唯一的生路。'
      },
      characters: [
        {
          id: 'c1',
          name: '林周（我）',
          oneLineBio: '背负巨债、拼命接夜间加价单的沉默外卖骑手',
          desire: '尽快还清债务，保住性命',
          functionInStory: '主角，从唯利是图到直面罪咎'
        },
        {
          id: 'c2',
          name: '老陈',
          oneLineBio: '负责管区命案的颓唐老刑警，眼神毒辣',
          desire: '抓到连环意外死亡背后的真正元凶',
          functionInStory: '主要阻碍者与真相催化剂'
        },
        {
          id: 'c3',
          name: '派单语音（系统）',
          oneLineBio: '冰冷机械但对林周过往了如指掌的派单后台',
          desire: '引导林周按照既定审判流程走完',
          functionInStory: '核心对抗力量与高压引擎'
        }
      ],
      synopsis: '林周为了还债专接午夜「高危加价单」。某天他发现自己的手表时间与手机派单时间差了整整一小时，凡是他超时的地址，次日清晨都会被警戒线封锁。老刑警老陈找上门审讯，林周在逃亡与接单之间挣扎，直到最后一单跳出自己的名字与家庭住址。',
      skeleton: [
        {
          actNumber: 1,
          actName: '① 钩子',
          percentage: '8%',
          description: '林周在午夜接下一单送到废弃大厦的牛肉面，超时三分钟送达后，次日新闻报道该租客心脏骤停猝死，林周手表莫名停摆一小时。',
          checkpoint: '首个异常事件在开篇500字内爆发，抛出时间差物件。'
        },
        {
          actNumber: 2,
          actName: '② 冲突建立',
          percentage: '22%',
          description: '林周试图退件注销账号，但账号余额扣至负数，且机械音直接报出他母亲的透析病房号。老刑警老陈截停他的电瓶车，出示三起猝死现场监控，林周都在场。',
          checkpoint: '读者一句话明确林周想要脱身但退路被封死。'
        },
        {
          actNumber: 3,
          actName: '③ 转折 / 二次打击',
          percentage: '28%',
          description: '第三个订单强行派发，地址是老陈的独生女学校。林周拼命赶在倒计时前送达救人，却在包裹里摸到带血的自己当年的欠条。老陈赶到时误会林周行凶。',
          checkpoint: '转折由前文因果自然引出，并非机械天降。'
        },
        {
          actNumber: 4,
          actName: '④ 高潮',
          percentage: '30%',
          description: '最后一单派发：收件人正是「林周」，送达时限仅剩120秒。林周不再逃跑，当面把手机摔给老陈，按下了自首与转让赔偿协议，选择直面当年的逃逸真相。',
          checkpoint: '主角主动做出生死抉择并付出实质性代价。'
        },
        {
          actNumber: 5,
          actName: '⑤ 钉子 / 余味',
          percentage: '12%',
          description: '心电监护仪的滴答声响起，林周在ICU睁开眼，病床旁放着那块停在三年前事故当晚的手表，指针终于轻轻跳动了一格。',
          checkpoint: '贯穿物件手表在首尾闭环，留有余味。'
        }
      ],
      scenes: [
        {
          id: 's1',
          sceneNumber: 1,
          actName: '① 钩子',
          locationAndTime: '暴雨深夜 / 烂尾楼楼道',
          whatHappens: '林周送餐迟到三分钟，敲开门只见屋里一片漆黑，顾客伸手接过外卖，手指冰凉僵硬。',
          statusChange: '林周赚到两百元加价费，但发现机械表指针莫名倒退一小时。',
          causality: '因为林周急需赚母亲透析费，所以违规接了午夜高额冷门单。',
          charactersPresent: '林周、神秘取餐者',
          hookOrResolution: '次日早晨看到该户主昨晚已猝死的新闻。'
        },
        {
          id: 's2',
          sceneNumber: 2,
          actName: '② 冲突建立',
          locationAndTime: '次日午后 / 街角快餐店与交警岗亭',
          whatHappens: '林周在二手维修铺检查手表无果，老陈突然跨坐在他后座，掏出带有林周背影的监控截图。',
          statusChange: '信息差被打破，林周从普通骑手沦为连环猝死案第一嫌疑人。',
          causality: '但是因为林周必须自证清白，他决定查清楚派单系统的物理服务器。',
          charactersPresent: '林周、老陈',
          hookOrResolution: '老陈留下传唤单，警告他今晚八点必须到派出所。'
        },
        {
          id: 's3',
          sceneNumber: 3,
          actName: '② 冲突建立',
          locationAndTime: '傍晚 / 外卖总站仓库',
          whatHappens: '林周点击注销账户，手机扬声器突然发出滋滋杂音，直接报出老家母亲的床位编号，强制派发新单。',
          statusChange: '林周确认软件有人在远程监控并威胁自己家庭，逃跑彻底失效。',
          causality: '因此林周不得不重新戴上头盔跨上车。',
          charactersPresent: '林周、站长（功能性角色）',
          hookOrResolution: '新单倒计时只有18分钟，距离却有15公里。'
        },
        {
          id: 's4',
          sceneNumber: 4,
          actName: '③ 转折 / 二次打击',
          locationAndTime: '夜间八点 / 实验中学后街',
          whatHappens: '林周顶着暴雨飙车冲进校门，将外卖箱里的哮喘喷雾拍在濒临窒息的女孩手里，而女孩正是老陈的女儿。',
          statusChange: '受害者被救下，证明系统并非单纯杀人，而是在执行针对林周的道德拷问。',
          causality: '但是老陈开车撞见林周抓着自己女儿，当场掏枪将林周按在泥水里。',
          charactersPresent: '林周、老陈、陈小悦',
          hookOrResolution: '外卖纸袋破裂，掉出一份三年前林周肇事逃逸的私了协议复印件。'
        },
        {
          id: 's5',
          sceneNumber: 5,
          actName: '④ 高潮',
          locationAndTime: '午夜十一点五十 / 跨江大桥中央',
          whatHappens: '手机再次炸响最高级警报，收件人赫然显示为「林周」，倒计时仅剩60秒。林周面对枪口，把手机和欠条塞进老陈手里。',
          statusChange: '林周彻底放弃侥幸，承认当年所有罪责，主动承担惩罚。',
          causality: '因此在最后十秒，林周没有逃向安全区，而是推开了失控冲向老陈的失控重卡。',
          charactersPresent: '林周、老陈',
          hookOrResolution: '撞击轰鸣中，手机屏幕跳出「订单已完成，欠款结清」。'
        },
        {
          id: 's6',
          sceneNumber: 6,
          actName: '⑤ 钉子 / 余味',
          locationAndTime: '清晨 / 省医院重症监护室',
          whatHappens: '老陈站在床头，给昏迷初醒的林周扣上手铐，但也放下一份工伤救济认定书。林周手腕上的机械表重新开始走动。',
          statusChange: '法律代价与救赎闭环，林周失去自由但拿回了活着的灵魂。',
          causality: '因此故事在闭环中沉淀出余韵。',
          charactersPresent: '林周、老陈',
          hookOrResolution: '留白结语：欠时间的人，终究得拿命还。'
        }
      ],
      recurringObjects: [
        { name: '停摆一小时的机械表', app1: '第1场：超时三分钟后手表时间神秘后退', app2: '第4场：泥水中林周用表盘反光看清追兵', app3: '第6场：监护室里表针重新跳动闭环' },
        { name: '三年前的私了欠条', app1: '第3场：作为威胁密码由系统念出', app2: '第4场：从外卖箱滑落坐实当年罪名', app3: '第5场：林周亲手交出协议不再掩饰' }
      ],
      qualityGates: [
        { code: 'A1', category: 'A类 结构门', name: '一句话故事线含人+麻烦', description: '外卖员+超时死人', passed: true, notes: '核心矛盾鲜明' },
        { code: 'A2', category: 'A类 结构门', name: '首事件在10%内发生', description: '第1场即发生超时猝死', passed: true, notes: '前500字直切冲突' },
        { code: 'A3', category: 'A类 结构门', name: '主角目标具体可判定', description: '摆脱系统死亡惩罚', passed: true, notes: '目标生死攸关' },
        { code: 'A4', category: 'A类 结构门', name: '主角不可退出', description: '退出即抹杀且危及家人', passed: true, notes: '高压引擎成立' },
        { code: 'A5', category: 'A类 结构门', name: '高潮主角主动选择', description: '主动交底舍身救人', passed: true, notes: '非外部机械降神' },
        { code: 'B1', category: 'B类 因果门', name: '场景数5-12张', description: '共6张场景卡', passed: true, notes: '体量结构适中' },
        { code: 'B2', category: 'B类 因果门', name: '每场非空状态变化', description: '6场皆有关键信息/权力反转', passed: true, notes: '无空转场景' },
        { code: 'B3', category: 'B类 因果门', name: '相邻场景因此/但是连接', description: '全链条因果咬合', passed: true, notes: '符合South Park法则' },
        { code: 'C1', category: 'C类 兑现门', name: '结尾元素前文铺垫', description: '机械表与车祸欠条三次出现', passed: true, notes: '首尾呼应闭环' },
        { code: 'C8', category: 'C类 兑现门', name: '全篇大纲无成段对白', description: '全叙述体施工图', passed: true, notes: '格式完全合规' }
      ],
      ledgers: {
        timeline: [
          { scene: 1, day: '第1天', time: '23:45', note: '首单暴雨送餐' },
          { scene: 2, day: '第2天', time: '14:20', note: '老陈盘问' },
          { scene: 3, day: '第2天', time: '18:50', note: '注销失败与绑架威胁' },
          { scene: 4, day: '第2天', time: '20:10', note: '救下老陈女儿' },
          { scene: 5, day: '第2天', time: '23:55', note: '桥头生死对决' },
          { scene: 6, day: '第3天', time: '08:00', note: '病房收尾' }
        ],
        numbers: [
          { item: '林周年龄', value: '29岁', scenes: '第2场、第5场' },
          { item: '欠款数额', value: '38万', scenes: '第1场、第4场' },
          { item: '透析病房号', value: '407床', scenes: '第3场' }
        ],
        hooks: [
          { hook: '为什么手表指针倒退一小时', plantedScene: '第1场', redeemedScene: '第6场', status: '已兑现' },
          { hook: '老陈女儿与三年前事故的关系', plantedScene: '第2场', redeemedScene: '第4场', status: '已兑现' },
          { hook: '最后一单收件人到底是谁', plantedScene: '第3场', redeemedScene: '第5场', status: '已兑现' }
        ]
      }
    },
    lead: {
      cause: '暴雨夜平台派来一单限时二十五分钟的深山外卖。',
      conflict: '拒单直接扣除命数时间，准时送达却发现收件人早已在三年前车祸身亡。',
      personaBottom: '林周不是待宰羔羊，他手腕上还戴着当年那场车祸留下的停摆机械表，他清楚每一个受害者的名字。',
      reversalHook: '他不知道，今夜所有被系统选中的送单人，都曾坐在那辆肇事车上。',
      specificObject: '锈蚀停摆的机械表',
      informationGap: '林周知道受害者名单全部指向三年前的雨夜，但派单系统不知道他留了行车记录仪存储卡。',
      leadText: `暴雨拍在头盔面罩上，水花刮得生疼。
手机屏幕突然亮起幽绿的光，超时倒计时只剩三分十一秒。
那张折痕泛黄的送餐小票上，收件人名字被雨水晕开。
林周抹了把脸上的冷水，右手死死攥住生锈的车把。
他比谁都清楚，这个地址三年前就已经被推土机夷为平地。
平台客服的机械音在耳麦深处嘶哑地笑。
「林师傅，送完这单，你的债就一笔勾销了。」
他低头看了一眼手腕上停摆的旧表。
秒针突然发疯似地往回倒转了一整圈。`,
      charCount: 202
    },
    chapters: [
      {
        id: 'sec_1',
        sectionNumber: 1,
        title: '① 钩子 · 暴雨夜荒野订单',
        sceneRefIds: ['s1'],
        content: `雨势大得像是有人在半空往下泼铅水。
电动车的破大灯在水泥路上晃荡，照出一洼洼泛着机油虹彩的浑水。
手机在防水套里猛烈震动，蜂鸣声尖锐得刺耳。
【紧急加价单：已超时2分18秒。配送费：¥380.00。】
三百八十块，够我妈在透析室多换两根透析管。
我抹了一把脸上的冰雨，手套浸透了腥味。
目的地在半山腰的烂尾别墅区，七号楼。
我顺着没有扶手的潮湿水泥楼梯爬上三楼，防盗门敞着一条缝。
屋里没开灯，只有一股浓烈发苦的消毒水味。
外卖盒被我放在积灰的塑料茶几上。
「外卖到了，麻烦给个好评。」
没有人应声。
只有穿堂风吹得塑料袋沙沙响。
我掏出手机点「已送达」，屏幕却猛然跳出一行猩红的报错弹窗：
【检测到异常！收件人生命体征已于03:42分归零。】
【本次配送判定全责超时，扣除骑手林周生理寿命：120分钟。】
手机右上角的电量图标突兀地变成了一个跳动的沙漏，数字从「68」骤降至「66」。
那一刻，我的喉咙像是被水泥堵死。
我抓起茶几上的外卖单，收件人栏写着三个字：周海生。
周海生，正是三年前我开货车撞死的那位泥瓦匠。`,
        wordCount: 468,
        hasHeartbreakSwitch: false,
        hasPaywallCutoff: false
      }
    ]
  },
  {
    id: 'daichi',
    title: '代持底牌',
    badge: '家庭·爽感释放',
    emotion: '爽感释放',
    premise: '老公拿我妈的手术费给白月光买车，他不知道公司的原始股权全由我代持。',
    fullOutline: {
      title: '代持底牌',
      params: {
        form: 'novel',
        targetLength: '12000字',
        targetEmotion: '爽感释放',
        genre: '现实婚恋·逆袭复仇',
        pov: '第一人称「我」',
        endingTone: '闭环',
        strategy: '戏剧性反讽（读者交底）',
        premise: '老公拿我妈的手术费给白月光买车，他不知道公司的原始股权全由我代持。'
      },
      logline: '结婚五年的妻子撞破丈夫转走母亲救命钱给白月光购置豪宅，凭借婚前私下签署的绝对控股代持协议，在丈夫引以为傲的融资敲钟现场完成权力收网。',
      storyContract: {
        goal: '拿回母亲的手术费，依法收回属于自己的公司绝对控制权，让背叛者净身出户。',
        obstacle: '丈夫转移婚内资产、婆家全员合谋作伪证、白月光在投资圈的舆论抹黑。',
        engine: '母亲手术仅剩48小时筹资期，若任由丈夫完成本轮融资，代持股权将被稀释退场。',
        changePerRound: '从被全家道德绑架的「免费保姆」逐步亮出法律铁证，每轮让对方失去一项核心资产。',
        finalOutcome: '股东大会当场罢免丈夫职务，追回所有转移资产，母亲手术顺利完成。',
        theme: '当感情沦为算计的遮羞布，法律和清醒是女人唯一的盔甲。'
      },
      characters: [
        {
          id: 'c1',
          name: '苏晴（我）',
          oneLineBio: '表面隐忍温和、实则名牌政法大学毕业掌控公司底牌的妻子',
          desire: '救活母亲，拿回属于自己的全部尊严与资产',
          functionInStory: '主角，双轨腔调核心代表'
        },
        {
          id: 'c2',
          name: '顾明轩',
          oneLineBio: '自负贪婪、靠妻子娘家发家却妄图金蝉脱壳的创业新贵',
          desire: '完成B轮融资，逼苏晴净身出户迎娶白月光',
          functionInStory: '主要施害者与被审判对象'
        },
        {
          id: 'c3',
          name: '叶薇',
          oneLineBio: '高调嚣张、深谙职场与绿茶话术的投资经理兼白月光',
          desire: '上位顾太太，洗白转移过来的千万资金',
          functionInStory: '副反派，催化冲突与当众打脸催化剂'
        }
      ],
      synopsis: '苏晴母亲突发重病急需五十万手术押金，苏晴查账却发现卡里存款全被丈夫顾明轩划走，用于给海归合伙人叶薇订购限量跑车。顾明轩理直气壮指责苏晴贪财小气。苏晴那一刻心死，默默取出藏在老宅保险箱里的股权代持协议公证书。两天后的投资人答谢宴上，苏晴优雅现身，将顾明轩亲手送上被告席与失信人名单。',
      skeleton: [
        {
          actNumber: 1,
          actName: '① 钩子',
          percentage: '10%',
          description: '苏晴在医院缴费处刷卡失败，同一秒朋友圈刷出顾明轩给叶薇庆生送保时捷的合影，配文「十年长跑，终得所愿」。苏晴打电话求救被冷漠训斥。',
          checkpoint: '开篇三句话砸下重病+断款+当众背叛三件事。'
        },
        {
          actNumber: 2,
          actName: '② 冲突建立',
          percentage: '20%',
          description: '苏晴回家理论，婆婆与小姑子堵门冷嘲热讽，顾明轩扔出离婚协议书要她净身出户。苏晴发现银行流水显示公司大额资金已被非法转入皮包公司。',
          checkpoint: '确立主角反击动机与高压时间限制。'
        },
        {
          actNumber: 3,
          actName: '③ 转折 / 二次打击',
          percentage: '25%',
          description: '顾明轩以为胜券在握，提前举办B轮签约香槟酒会。叶薇端着酒杯到苏晴面前挑衅，苏晴平静地将红酒泼在代持协议影印件上。',
          checkpoint: '主角双轨声线彻底切换为冷静审判。'
        },
        {
          actNumber: 4,
          actName: '④ 高潮',
          percentage: '35%',
          description: '主投资人入场，苏晴出示工商底册与经侦立案回执，以持股67%实际控制人身份叫停签约，并当场解聘顾明轩，冻结其个人全部账户。',
          checkpoint: '当众见证放大羞辱感，掌控者话短利落。'
        },
        {
          actNumber: 5,
          actName: '⑤ 钉子 / 余味',
          percentage: '10%',
          description: '顾明轩在看守所哭求复合，苏晴隔着玻璃平静签下离婚判决书，转身走进母亲刚推出来的无菌观察室，夕阳温暖。',
          checkpoint: '漠视收口，没有多余升华，痛快利落。'
        }
      ],
      scenes: [
        {
          id: 's1',
          sceneNumber: 1,
          actName: '① 钩子',
          locationAndTime: '暴风雨午后 / 市一院急诊缴费窗口',
          whatHappens: '苏晴手中的银行卡三次提示余额不足，身后的护士催促签字，手机屏幕适时亮起顾明轩晒跑车的朋友圈。',
          statusChange: '资金链断裂，母亲面临停药危机，婚姻温情假象瞬间撕碎。',
          causality: '因为顾明轩暗中转移了联名账户所有存款。',
          charactersPresent: '苏晴、收费员',
          hookOrResolution: '顾明轩电话回拨第一句：「别装了，你妈少做一次透析死不了。」'
        },
        {
          id: 's2',
          sceneNumber: 2,
          actName: '② 冲突建立',
          locationAndTime: '当晚七点 / 婚房客厅',
          whatHappens: '顾明轩带叶薇回婚房拿红酒，婆婆热络招待，反将苏晴锁在客房。苏晴当面要求归还五十万，顾明轩摔碎结婚照。',
          statusChange: '心死定格句出现，苏晴彻底放弃挽回，启动法律程序。',
          causality: '但是因为婆家集体抱团，直接将离婚协议拍在她脸上。',
          charactersPresent: '苏晴、顾明轩、叶薇、婆婆',
          hookOrResolution: '苏晴冷笑一声：「明天股东会，希望你还能这么大声。」'
        },
        {
          id: 's3',
          sceneNumber: 3,
          actName: '③ 转折 / 二次打击',
          locationAndTime: '次日上午 / 律所与经侦大队',
          whatHappens: '苏晴带上当年的代持协议公证书与隐蔽转账凭单，经侦确认涉嫌职务侵占罪并予以受理。',
          statusChange: '苏晴掌握绝对法律核按钮，完成猎人与猎物身份调换。',
          causality: '因此苏晴得以在法律框架内申请全额资产保全。',
          charactersPresent: '苏晴、陈律师',
          hookOrResolution: '保全裁定书盖章，顾明轩名下所有微信支付宝及银行卡秒级冻结。'
        },
        {
          id: 's4',
          sceneNumber: 4,
          actName: '④ 高潮',
          locationAndTime: '当晚八点 / 希尔顿顶层宴会厅签约现场',
          whatHappens: '顾明轩刚接过话筒宣布成为独角兽CEO，苏晴推门而入，身后跟着法警与财务审计组。大屏幕直接切换为资金侵占流水账单。',
          statusChange: '顾明轩身败名裂，投资人当场撤资，叶薇惊恐撇清关系。',
          causality: '因为苏晴手握67%表决权，直接宣布就地免去顾明轩执行董事职务。',
          charactersPresent: '苏晴、顾明轩、叶薇、资方代表、全场宾客',
          hookOrResolution: '顾明轩跪地抱住苏晴的裤脚，苏晴只回了一个字：「滚。」'
        },
        {
          id: 's5',
          sceneNumber: 5,
          actName: '⑤ 钉子 / 余味',
          locationAndTime: '三天后 / 医院阳光花园',
          whatHappens: '苏晴收到法院生效裁判与冻结款划拨通知，母亲术后指标全部正常。叶薇的车被法院拖车拉走。',
          statusChange: '主角夺回全部资产与新生，恶人得到应有报应。',
          causality: '因此生活重归宁静，闭环圆满。',
          charactersPresent: '苏晴、母亲',
          hookOrResolution: '落点金句：属于我的每一分，你连本带利吐出来。'
        }
      ],
      recurringObjects: [
        { name: '泛黄的代持协议公证书', app1: '第2场：苏晴在锁着的抽屉摸出公证书红印', app2: '第3场：律师灯下摊开确认签名具有不可撤销效力', app3: '第4场：甩在签约演讲台上击穿顾明轩幻象' },
        { name: '结婚五周年定制对戒', app1: '第1场：苏晴摩挲戒指发现卡被刷爆', app2: '第2场：顾明轩嫌恶地拔下来扔进垃圾桶', app3: '第5场：被当成婚内折旧资产随案卷移交' }
      ],
      qualityGates: [
        { code: 'A1', category: 'A类 结构门', name: '一句话故事线含人+麻烦', description: '妻子与转移资产丈夫', passed: true, notes: '目标阻碍极其明确' },
        { code: 'A2', category: 'A类 结构门', name: '首事件在10%内发生', description: '急诊刷卡被拒+朋友圈晒车', passed: true, notes: '前200字爆发' },
        { code: 'A3', category: 'A类 结构门', name: '主角目标具体可判定', description: '追回资金并罢免丈夫', passed: true, notes: '胜败界限极清' },
        { code: 'A4', category: 'A类 结构门', name: '主角不可退出', description: '母亲48小时内手术救命', passed: true, notes: '高压不可撤退' },
        { code: 'A5', category: 'A类 结构门', name: '高潮主角主动选择', description: '带法警与证据当场控场', passed: true, notes: '主动亮剑无神兵天降' },
        { code: 'B1', category: 'B类 因果门', name: '场景数5-12张', description: '共5张场景卡', passed: true, notes: '紧凑高效' },
        { code: 'B2', category: 'B类 因果门', name: '每场非空状态变化', description: '每场皆有资产或权力转移', passed: true, notes: '节奏明快' },
        { code: 'B3', category: 'B类 因果门', name: '相邻场景因此/但是连接', description: '严格遵照South Park法则', passed: true, notes: '因果链紧实' },
        { code: 'C1', category: 'C类 兑现门', name: '结尾元素前文铺垫', description: '代持协议贯穿始终', passed: true, notes: '无突降道具' },
        { code: 'C8', category: 'C类 兑现门', name: '全篇大纲无成段对白', description: '全叙述体施工图', passed: true, notes: '合规' }
      ],
      ledgers: {
        timeline: [
          { scene: 1, day: '周四', time: '15:30', note: '急诊欠费' },
          { scene: 2, day: '周四', time: '19:00', note: '婚房决裂' },
          { scene: 3, day: '周五', time: '09:30', note: '经侦立案' },
          { scene: 4, day: '周五', time: '20:00', note: '宴会收网' },
          { scene: 5, day: '下周一', time: '10:00', note: '术后新生' }
        ],
        numbers: [
          { item: '母亲手术押金', value: '50万', scenes: '第1场、第2场' },
          { item: '代持股权比例', value: '67%', scenes: '第3场、第4场' },
          { item: '保时捷购置款', value: '148万', scenes: '第1场、第4场' }
        ],
        hooks: [
          { hook: '顾明轩母亲藏起来的私章在哪里', plantedScene: '第2场', redeemedScene: '第3场', status: '已兑现' },
          { hook: '投资人是否提前知晓代持实情', plantedScene: '第3场', redeemedScene: '第4场', status: '已兑现' }
        ]
      }
    },
    lead: {
      cause: '母亲突发脑溢血推进重症监护室，医院催缴五十万押金。',
      conflict: '我拿着银行卡去缴费，POS机连吐三张红单显示余额不足，而丈夫五分钟前在朋友圈晒出送给女秘书的保时捷提车照。',
      personaBottom: '苏晴没有在医院哭天抢地，她冷冷关掉手机屏幕，拉开了抽屉最底层的暗格。她不是待宰的原配，顾明轩名下那家估值两亿的科技公司，原始股权代持协议上的受托人全都是她的名字。',
      reversalHook: '顾明轩以为夺走的是我妈的救命钱，他不知道，明天的投资人签约大会上，真正拥有签字权的人只有我。',
      specificObject: '泛黄的代持协议公证书',
      informationGap: '顾明轩不知道母亲藏在老家衣柜里的私章早已被苏晴公证挂失，代持协议在公司法上具有绝对优先权。',
      leadText: `抢救室外消毒水的气味钻得鼻腔生疼。
护士把欠费催缴单第十三次递到我跟前。
「苏小姐，五十万押金今晚结不清，药只能停了。」
我低头看着手机屏幕上跳出来的朋友圈。
丈夫顾明轩十分钟前发了一张九宫格。
红丝绒车罩揭开的一角，保时捷车标锃亮。
配文只有四个字：「赠我心软的小朋友。」
那张购车刷卡凭证的一角，赫然印着我的主卡卡号。
我没哭，甚至连眼泪都没挤出一滴。
我只是拉开包底拉链，摸出了那本盖着红印的股权代持公证书。
那一刻，我的心彻底死了。
他不知道，明天他办庆功宴的科技大厦，业主签字栏里写的是我的名字。`,
      charCount: 228
    },
    chapters: [
      {
        id: 'sec_1',
        sectionNumber: 1,
        title: '① 钩子 · 医院催缴与提车朋友圈',
        sceneRefIds: ['s1'],
        content: `急诊大厅里的冷气开得很足，白炽灯把每一个人的脸照得毫无血色。
护士台前的打印机嗡嗡作响，吐出一张带着墨迹余温的红色欠费单。
「苏女士，ICU一天的基础监护费就得两万八。」
小护士有些同情地看着我被雨水淋透的裤脚：
「账面余额只剩三块四毛二，最迟明天上午十点，要是押金再进不来，进口升压泵就得停。」
我点点头，接过那张薄如蝉翼的单子。
指尖触碰到纸面，甚至能摸到防伪水印的凸起。
三分钟前，我刚给顾明轩打了第七个电话。
第七次被按掉。
第八次打过去，直接变成了机械的关机提示音。
走廊尽头的候诊椅上，几个家属正在刷短视频。
我掏出快要没电的手机，微信界面的红点多得让人心慌。
高中同学群里忽然有人艾特我：
【苏晴，你家明轩太浪漫了吧，这得小两百万吧？】
附带一张截图。
是顾明轩在十分钟前公开的一条朋友圈动态。
照片里，市中心保时捷交付中心被摆满了红玫瑰，女秘书温倩双手捧着钥匙，笑得眼角泛红。
而交付单右下角刷卡记录上的尾号「8809」，是我母亲当年卖掉老屋拆迁款存入的那张卡。
那一刻，周围所有的嘈杂仿佛瞬间退潮。
我没有像电视剧里那样歇斯底里地砸掉手机。
我只是从随身帆布包里，拿出了那个磨损严重的文件袋。
袋子里静静躺着一份五年前的公证书。
顾明轩以为这家估值一点八亿的公司是他的跳板。
他忘了，当年他因为有失信记录办不下执照，所有创始出资与股权，全部由我一人代持。`,
        wordCount: 560,
        hasHeartbreakSwitch: false,
        hasPaywallCutoff: false
      }
    ]
  }
];

export const INITIAL_OUTLINE: OutlineData = PRESET_IDEAS[0].fullOutline;
export const INITIAL_LEAD: YanYanLead = PRESET_IDEAS[0].lead;
export const INITIAL_CHAPTERS: ChapterSection[] = PRESET_IDEAS[0].chapters;

