import {
    AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Optional, Output, ViewChild
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";
import {JigsawTabsModule} from "../tabs/index";
import {JigsawTileSelectModule} from "../list-and-tile/tile";
import {JigsawTab} from "../tabs/tab";
import {AbstractJigsawComponent, IDynamicInstantiatable} from "../common";
import {CommonUtils} from "../../core/utils/common-utils";
import {ArrayCollection} from "../../core/data/array-collection";
import {LoadingService} from "../../service/loading.service";
import {InternalUtils} from "../../core/utils/internal-utils";
import {TranslateHelper} from "../../core/utils/translate-helper";
import {TreeData} from "../../core/data/tree-data";

export class CascadeData {
    /**
     * tab的标题文本
     *
     * @type {string}
     */
    title: string;
    /**
     * 级联选项的数据集,支持静态和异步数据
     *
     * @type {any[] | Observable<any[]>}
     */
    list: any[] | Observable<any[]>;
    /**
     * 是否级联结束，不设置默认为不结束
     *
     * @type {boolean}
     */
    noMore?: boolean;
    /**
     * 是否显示“全部”按钮，不设置默认为不显示
     *
     * @type {boolean}
     */
    showAll?: boolean;
    labelField?: string;
    trackItemBy?: string | string[];
}

/**
 * 生成级联数据的函数类型
 * @params selectedItem: 上一级选中的item，可作为查询这一级数据的条件
 *         selectedItems: 已有的所有级items
 *         data: 已有的所有级的数据集合
 *         level: 当前tab的下标索引值，从0开始
 * @returns {CascadeData}
 */
export type CascadeDateGenerator = (selectedItem: any, selectedItems: any[], data: any[], level: number) => CascadeData;

export class CascadeTabContentInitData {
    level: number;
    list: any[] | Observable<Object>;
    noMore: boolean;
    multipleSelect: boolean;
    showAll: boolean;
}

/**
 * 一种通用的级联选择组件，
 * - 支持静态数据和异步数据
 * - 支持单选和多选
 * - 支持跨维度的多选
 * - 支持选择全部
 *
 * $demo = cascade/basic
 * $demo = cascade/multiple-select
 * $demo = cascade/multi-dimensional-select
 */
@Component({
    selector: 'jigsaw-cascade, j-cascade',
    template: '<j-tabs [style.width]="width" [style.height]="height" style="border: 1px solid"></j-tabs>',
    host: {
        '[class.jigsaw-cascade]': 'true',
        '[style.width]': 'width',
        '[style.height]': 'height'
    }
})
export class JigsawCascade extends AbstractJigsawComponent implements AfterViewInit, OnInit {
    constructor(private _changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    /**
     * @internal
     */
    @ViewChild(JigsawTab) public _tabs: JigsawTab;

    /**
     * @internal
     */
    public _cascadeData: CascadeData[] = [];

    /**
     * 生成级联数据的函数，一般用于需要异步加载的数据的生产
     *
     * $demo = cascade/basic
     * $demo = cascade/multiple-select
     */
    @Input()
    public dataGenerator: CascadeDateGenerator;

    /**
     * 一般配合`dataGenerator`使用，用于指明`dataGenerator`函数执行的上下文对象，
     * 忽略此值时，`dataGenerator`函数中的`this`将指向一个空对象。
     *
     * 注意，如果`data`属性的值是一个函数，则该函数的执行上下文也是此属性指定的对象。
     *
     * $demo = cascade/lazy-load
     */
    @Input()
    public generatorContext: any;

    private _data: CascadeDateGenerator | TreeData;

    /**
     * 级联数据
     * - 可以是一个生产数据的函数，参考`dataGenerator`
     * - 也可以是一个有层级关系的静态数据，参考`TreeData`
     */
    @Input()
    public get data(): CascadeDateGenerator | TreeData {
        return this._data;
    }

    public set data(value: CascadeDateGenerator | TreeData) {
        this._data = value;
        if (value instanceof Function) {
            this.dataGenerator = value;
        } else if (!!value) {
            this.dataGenerator = this._treeDataGenerator;
        } else {
            this.dataGenerator = this._dummyGenerator;
        }
    }

    private _treeDataGenerator(selectedItem: any): CascadeData {
        const cd = new CascadeData();
        const td = <TreeData>this.data;
        const si = selectedItem ? selectedItem : td;
        cd.list = si.nodes;
        cd.title = si.title;
        cd.noMore = td.noMore;
        cd.showAll = td.showAll;
        cd.labelField = td.labelField;
        cd.trackItemBy = td.trackItemBy;
        return cd;
    }

    private _dummyGenerator(): CascadeData {
        return null;
    }

    /**
     * 级联选择的数据
     * @type {Array}
     *
     * $demo = cascade/basic
     * $demo = cascade/multiple-select
     */
    @Input()
    public selectedItems = [];

    /**
     * 级联选择数据发生变化时发送的事件
     * @type {EventEmitter<any[]>}
     *
     * $demo = cascade/basic
     * $demo = cascade/multiple-select
     */
    @Output()
    public selectedItemsChange = new EventEmitter<any[]>();

    /**
     * 数据要显示的文本key
     * @type {string}
     *
     * $demo = cascade/basic
     * $demo = cascade/multiple-select
     */
    @Input()
    public labelField: string = 'label';

    private _trackItemBy: string[];

    /**
     * 数据的标识，用于判断是否为同一个数据，默认是{@link labelField}的值
     * @returns {string | string[]}
     */
    @Input()
    public get trackItemBy(): string | string[] {
        return this._trackItemBy;
    }

    public set trackItemBy(value: string | string[]) {
        if (!value) {
            return;
        }
        this._trackItemBy = typeof value === 'string' ? value.split(/\s*,\s*/g) : value;
    }

    /**
     * 配置是否可多选
     *
     * $demo = cascade/multiple-select
     * $demo = cascade/preset-multi-data
     */
    @Input()
    public multipleSelect: boolean;

    /**
     * 是否可以跨维度多选
     *
     * $demo = cascade/multi-dimensional-select
     * $demo = cascade/preset-multi-dimensional-data
     */
    @Input()
    public autoClear: boolean;

    /**
     * @internal
     */
    public _handleMultipleSelect(selectedItems: any[], level: number) {
        if (this.autoClear && this.selectedItems[level]) {
            // 支持多维
            // 过滤掉已有的但是现在不选的
            const compare = CommonUtils.compareWithKeyProperty;
            this.selectedItems[level] = this.selectedItems[level].filter(item => {
                const list = <any[]>this._cascadeData[level].list;
                const inThisTab = list.find(it => compare(item, it, this._trackItemBy));
                // 不是此维度的保留
                if (!inThisTab) {
                    return true;
                }
                // 在选中项里的保留，不在选中项里的去掉
                return selectedItems.find(it => compare(item, it, this._trackItemBy));
            });
            // 添加原来没选的但是现在选中的
            selectedItems.forEach(item => {
                if (!this.selectedItems[level].find(it => compare(item, it, this._trackItemBy))) {
                    this.selectedItems[level].push(item);
                }
            })
        } else {
            this.selectedItems[level] = [...selectedItems];
        }

        // 多选的tab是级联结束的地方，在这更新选中的数据
        this.selectedItemsChange.emit(this.selectedItems);
    }

    /**
     * @internal
     */
    public _handleSelect(selectedItem: any, level: number) {
        this._updateTabTitle(selectedItem, level);
        this.selectedItems[level] = selectedItem;
        if (this._cascadeData[level].noMore) {
            this.selectedItemsChange.emit(this.selectedItems);
        } else {
            this._cascading(level + 1, selectedItem);
        }
    }

    /**
     * @internal
     */
    public _selectAll(level: number) {
        if (this.multipleSelect && this.autoClear) {
            console.warn('multidimensional select can not select all');
            return;
        }
        this._removeCascadingTabs(level);
        this._tabs.selectedIndex = this._tabs.length - 1;
        this.selectedItems = this.selectedItems.slice(0, level);
        this.selectedItemsChange.emit(this.selectedItems);
    }

    private _addCascadingTab(level: number, lazy: boolean) {
        this._removeCascadingTabs(level);
        this._tabs.addTab(this._cascadeData[level].title, InternalTabContent, {
            level: level,
            list: this._cascadeData[level].list,
            noMore: this._cascadeData[level].noMore,
            multipleSelect: this._cascadeData[level].noMore && this.multipleSelect,
            showAll: this._cascadeData[level].showAll,
        }, !lazy);
    }

    private _removeCascadingTabs(level: number) {
        if (this._tabs.length > level) {
            for (let i = this._tabs.length - 1; i >= level; i--) {
                this._tabs.removeTab(i)
            }
        }
    }

    private _updateTabTitle(selectedItem: any, level: number) {
        if (!this._tabs._$tabPanes || !this._tabs._$tabPanes.toArray()[level]) return;
        this._tabs._$tabPanes.toArray()[level].title = selectedItem[this.labelField];
        this._changeDetectorRef.detectChanges();
    }

    private _cascading(level: number, selectedItem?: any, lazy?: boolean) {
        const levelData = CommonUtils.safeInvokeCallback(this.generatorContext, this.dataGenerator,
            [selectedItem, this.selectedItems, this._cascadeData, level]);
        if (!levelData || !levelData.list) {
            // 取不到下一级的数据，级联到此结束，更新选中的数据
            this.selectedItemsChange.emit(this.selectedItems);
            return;
        }
        this._cascadeData[level] = levelData;
        this._addCascadingTab(level, lazy);
    }

    private _fillBack() {
        this.selectedItems.forEach((item, index) => {
            this._cascading(index, this.selectedItems[index - 1], index != this.selectedItems.length - 1);
            // 多选时的最后一个tab采用默认title
            if (this._cascadeData[index].noMore && this.multipleSelect) return;
            this._updateTabTitle(item, index);
        })
    }

    ngOnInit() {
        super.ngOnInit();
        if (!this.trackItemBy) this.trackItemBy = this.labelField;
    }

    ngAfterViewInit() {
        // 等待tabs渲染
        if (!this.selectedItems || this.selectedItems.length == 0) {
            // 没有初始数据
            this._cascading(0);
        } else {
            this._fillBack();
        }
    }
}

/**
 * @internal
 */
@Component({
    template: `
        <j-tile [(selectedItems)]="_$selectedItems" (selectedItemsChange)="_$handleSelect($event)"
                [trackItemBy]="_$cascade?.trackItemBy" [multipleSelect]="initData.multipleSelect">
            <div *ngIf="initData?.showAll" class="jigsaw-tile-show-all"
                 (click)="_$cascade?._selectAll(initData.level)">
                {{'cascade.all' | translate}}
            </div>
            <j-tile-option *ngFor="let item of _$list" [value]="item" (click)="_$handleOptionClick()">
                {{item[_$cascade?.labelField]}}
            </j-tile-option>
        </j-tile>
    `
})
export class InternalTabContent extends AbstractJigsawComponent implements IDynamicInstantiatable, OnInit {
    constructor(@Optional() public _$cascade: JigsawCascade, private _loading: LoadingService) {
        super();
    }

    public initData: CascadeTabContentInitData;

    ngOnInit() {
        super.ngOnInit();

        if (!this.initData) {
            return;
        }

        let allSelectedData = this._$cascade.selectedItems[this.initData.level];
        if (CommonUtils.isDefined(allSelectedData)) {
            const isArray = allSelectedData instanceof ArrayCollection || allSelectedData instanceof Array;
            allSelectedData = isArray ? allSelectedData : [allSelectedData];
        }
        const list = this.initData.list;
        if (list instanceof Observable) {
            const popupInfo = this._loading.show();
            const subscriber = list.subscribe((data: any[]) => {
                this._$cascade._cascadeData[this.initData.level].list = data; // 更新list变成实体数据
                this._init(data, allSelectedData);

                subscriber.unsubscribe();
                popupInfo.dispose();
            }, () => subscriber.unsubscribe());
        } else if (list instanceof Array) {
            this._init(list, allSelectedData);
        }
    }

    /**
     * @internal
     */
    public _$selectedItems;

    public _$list: any[] = [];

    private _init(data: any[], allSelectedData: any[]) {
        this._$list = data;
        if (allSelectedData instanceof Array || allSelectedData instanceof ArrayCollection) {
            // 等待根据list数据渲染option后回填数据
            this.callLater(() => {
                this._$selectedItems = allSelectedData.filter(item => {
                    return this._$list.find(it =>
                        CommonUtils.compareWithKeyProperty(item, it, <string[]>this._$cascade.trackItemBy))
                });
            })
        }
    }

    /**
     * @internal
     */
    public _$handleSelect(selectedItems: any[]) {
        if (!this.initData.multipleSelect) {
            // 单选
            this._$cascade._handleSelect(selectedItems[0], this.initData.level);
        } else {
            // 多选，级联结束的tab
            this._$cascade._handleMultipleSelect(selectedItems, this.initData.level);
        }
    }

    /**
     * @internal
     */
    public _$handleOptionClick() {
        // 补充已选中的option不触发selectedItemsChange
        if (this.initData.noMore || this._$cascade._tabs.selectedIndex != this.initData.level) return;
        if (this._$cascade._tabs.selectedIndex < this._$cascade._tabs.length - 1) {
            this._$cascade._tabs.selectedIndex += 1;
        } else {
            this._$handleSelect(this._$selectedItems);
        }
    }
}

@NgModule({
    imports: [JigsawTabsModule, JigsawTileSelectModule, TranslateModule, CommonModule],
    declarations: [JigsawCascade, InternalTabContent],
    exports: [JigsawCascade],
    providers: [LoadingService, TranslateService],
    entryComponents: [InternalTabContent]
})
export class JigsawCascadeModule {
    constructor(ts: TranslateService) {
        InternalUtils.initI18n(ts, 'cascade', {
            zh: {
                all: "全部"
            },
            en: {
                all: "All"
            }
        });
        ts.setDefaultLang(ts.getBrowserLang());
        TranslateHelper.languageChangEvent.subscribe(langInfo => ts.use(langInfo.curLang));
    }
}
