import {Component} from "@angular/core";
import {CascadeDateGenerator} from "jigsaw/component/cascade/cascade";
import {ArrayCollection} from "jigsaw/core/data/array-collection";
import {HttpClient} from "@angular/common/http";
import {TreeData} from "../../../../jigsaw/core/data/tree-data";

@Component({
    templateUrl: './demo.component.html'
})
export class CascadeBasicDemoComponent {
    constructor(public http: HttpClient) {
    }

    areas = {
        title: '省/直辖市', nodes: [
            {
                label: '北京市', title: '区',
                nodes: [
                    {label: '东城区'},
                    {label: '西城区'},
                    {label: '朝阳区'},
                    {label: '丰台区'},
                    {label: '石景山区'},
                    {label: '海淀区'},
                    {label: '顺义区'},
                    {label: '通州区'},
                    {label: '大兴区'},
                    {label: '房山区'},
                    {label: '门头沟区'},
                    {label: '昌平区'},
                    {label: '平谷区'},
                    {label: '密云区'},
                    {label: '怀柔区'},
                    {label: '延庆区'},
                ]
            },
            {
                label: '上海市', title: '区',
                nodes: [
                    {label: '黄浦区'},
                    {label: '徐汇区'},
                    {label: '长宁区'},
                    {label: '静安区'},
                    {label: '普陀区'},
                    {label: '虹口区'},
                    {label: '杨浦区'},
                    {label: '浦东新区'},
                    {label: '闵行区'},
                    {label: '宝山区'},
                    {label: '嘉定区'},
                    {label: '金山区'},
                    {label: '松江区'},
                    {label: '青浦区'},
                    {label: '奉贤区'},
                    {label: '崇明区'},
                ]
            },
            {
                label: '江苏省', title: '市',
                nodes: [
                    {
                        label: '南京市', title: '区',
                        nodes: [
                            {label: '玄武区'},
                            {label: '秦淮区'},
                            {label: '鼓楼区'},
                            {label: '建邺区'},
                            {label: '雨花台区'},
                            {label: '栖霞区'},
                            {label: '浦口区'},
                            {label: '六合区'},
                            {label: '江宁区'},
                            {label: '溧水区'},
                            {label: '高淳区'},
                        ]
                    },
                    {
                        label: '无锡市', title: '区',
                        nodes: [
                            {label: '梁溪区'},
                            {label: '滨湖区'},
                            {label: '惠山区'},
                            {label: '锡山区'},
                            {label: '新吴区'},
                            {label: '江阴市'},
                            {label: '宜兴市'},
                        ]
                    },
                    {
                        label: '苏州市', title: '区',
                        nodes: [
                            {label: '姑苏区'},
                            {label: '相城区'},
                            {label: '吴中区'},
                            {label: '虎丘区'},
                            {label: '吴江区'},
                            {label: '常熟市'},
                            {label: '昆山市'},
                            {label: '张家港市'},
                            {label: '太仓市'},
                        ]
                    },
                ]
            },
            {
                label: '广东省', title: '市',
                nodes: [
                    {
                        label: '广州市', title: '区',
                        nodes: [
                            {label: '越秀区'},
                            {label: '荔湾区'},
                            {label: '海珠区'},
                            {label: '天河区'},
                            {label: '白云区'},
                            {label: '黄埔区'},
                            {label: '番禺区'},
                            {label: '花都区'},
                            {label: '南沙区'},
                            {label: '增城区'},
                            {label: '从化区'},
                        ]
                    },
                    {
                        label: '深圳市', title: '区',
                        nodes: [
                            {label: '福田区'},
                            {label: '罗湖区'},
                            {label: '南山区'},
                            {label: '盐田区'},
                            {label: '宝安区'},
                            {label: '龙岗区'},
                            {label: '龙华区'},
                            {label: '坪山区'},
                        ]
                    },
                    {
                        label: '汕头市', title: '区',
                        nodes: [
                            {label: '金平区'},
                            {label: '龙湖区'},
                            {label: '澄海区'},
                            {label: '濠江区'},
                            {label: '潮阳区'},
                            {label: '潮南区'},
                            {label: '南澳县'},
                        ]
                    },
                ]
            },
            {
                label: '四川省', title: '市',
                nodes: [
                    {
                        label: '成都市', title: '区',
                        nodes: [
                            {label: '武侯区'},
                            {label: '锦江区'},
                            {label: '青羊区'},
                            {label: '金牛区'},
                            {label: '成华区'},
                            {label: '龙泉驿区'},
                            {label: '温江区'},
                            {label: '新都区'},
                            {label: '青白江区'},
                            {label: '双流区'},
                            {label: '郫都区'},
                            {label: '蒲江县'},
                            {label: '大邑县'},
                            {label: '金堂县'},
                            {label: '新津县'},
                            {label: '都江堰市'},
                            {label: '彭州市'},
                            {label: '邛崃市'},
                            {label: '崇州市'},
                            {label: '简阳市'},
                        ]
                    },
                    {
                        label: '自贡市', title: '区',
                        nodes: [
                            {label: '自流井区'},
                            {label: '贡井区'},
                            {label: '大安区'},
                            {label: '沿滩区'},
                            {label: '荣县'},
                            {label: '富顺县'},
                        ]
                    },
                    {
                        label: '泸州市', title: '区',
                        nodes: [
                            {label: '江阳区'},
                            {label: '龙马潭区'},
                            {label: '纳溪区'},
                            {label: '泸县'},
                            {label: '合江县'},
                            {label: '叙永县'},
                            {label: '古蔺县'},
                        ]
                    },
                ]
            },
        ]
    };

    message: string = '--';

    parseMessage(selectedItems) {
        this.message = selectedItems.reduce((result, item) => {
            result.push(item.label);
            return result;
        }, []).join(' | ');
    }

    // ====================================================================
    // ignore the following lines, they are not important to this demo
    // ====================================================================
    summary: string = '';
    description: string = '';
    tags: string[] = [
        'JigsawCascade'
    ];
}

