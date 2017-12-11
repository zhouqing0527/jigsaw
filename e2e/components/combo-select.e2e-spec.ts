import {browser, element, by, $, $$} from 'protractor';
import {waitForNotPresence, waitForPresence} from "../utils/await";
import {expectToExist} from "../utils/asserts";
import {mouseMove} from "../utils/actions";
import {getWindowSize} from "../utils/popup";

describe('combo-select', () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
    });

    describe('test basic function', () => {
        it('should display options  and auto width when mouse enter into combo', async () => {
            await browser.get('/combo-select/auto-width');
            const selectEl = element(by.tagName('jigsaw-combo-select')),
                buttons = $$('jigsaw-tile-option');
            browser.actions().mouseMove(selectEl).perform();
            expect(selectEl.getText()).toBe('北京');
            await waitForPresence('jigsaw-tile');
            buttons.get(1).click();
            expect(selectEl.getText()).toBe('北京 上海');
            buttons.get(0).click();
            expect(selectEl.getText()).toBe('上海');
            expect(selectEl.getCssValue('width')).toBe(element(by.tagName('jigsaw-tile')).getCssValue('width'));
        });
        it('should change trigger when click button', async () => {
            await browser.get('/combo-select/change-trigger');
            const selectEl = $('jigsaw-combo-select'),
                buttons = $$('jigsaw-button');
            browser.actions().mouseMove(selectEl).perform();
            await waitForPresence('.drop-down-container');
            expect(buttons.count()).toBe(10);
            expectToExist('.drop-down-container');
            browser.actions().mouseMove({x: 1000, y: 135}).perform();
            await waitForNotPresence('.drop-down-container');
            expectToExist('.drop-down-container', false);
            buttons.get(0).click();
            selectEl.click();
            await waitForPresence('.drop-down-container');
            expectToExist('.drop-down-container');
        });
        it('should be disabled when toggle disable', async () => {
            await browser.get('/combo-select/disable');
            const selectEl = $('jigsaw-combo-select'),
                button = $$('jigsaw-button');
            browser.actions().mouseMove(selectEl).perform();
            await waitForPresence('jigsaw-tile');
            expectToExist('jigsaw-tile');
            button.click();
            browser.actions().mouseMove(selectEl).perform();
            await waitForNotPresence('jigsaw-tile');
            expectToExist('jigsaw-tile', false);
        });
        it('should display collapse when mouse enter combo-select', async () => {
            await browser.get('/combo-select/drop-down-status');
            const selectEl = $('jigsaw-combo-select'),
                collapse = $('jigsaw-collapse');
            mouseMove(selectEl);
            await waitForPresence('jigsaw-collapse');
            expectToExist('jigsaw-collapse');
        });
        it('drop down width should be set', async () => {
            await browser.get('/combo-select/drop-down-width');
            const selectEls = $$('jigsaw-combo-select'),
                tile = $('jigsaw-tile'),
                body = $('body');
            let bodySize;
            mouseMove(selectEls.get(0));
            await waitForPresence('jigsaw-tile');
            expect(tile.getCssValue('width')).toBe('400px');
            mouseMove({x: 1000, y: 1000});
            await waitForNotPresence('jigsaw-tile');
            mouseMove(selectEls.get(1));
            await waitForPresence('jigsaw-tile');
            bodySize = await body.getSize();
            expect(tile.getCssValue('width')).toBe(bodySize.width * 0.5 + 'px');
        });
        it('should toggle multiple & auto close on select', async () => {
            await browser.get('/combo-select/multiple');
            const selectEl = $('jigsaw-combo-select'),
                button = $('jigsaw-button'),
                tileOptions = $$('jigsaw-tile-option');
            button.click();
            browser.sleep(300);
            mouseMove(selectEl);
            await waitForPresence('jigsaw-tile');
            tileOptions.get(2).click();
            expect(element(by.tagName('jigsaw-tag')).element(by.tagName('span')).getText()).toBe('南京');
            await waitForNotPresence('jigsaw-tile');
            expectToExist('jigsaw-tile', false);
        });
        it('should open combo select through two ways', async () => {
            await browser.get('/combo-select/open');
            const buttons = $$('jigsaw-button');
            buttons.get(0).click();
            await waitForPresence('jigsaw-tile');
            expectToExist('jigsaw-tile');
            buttons.get(0).click();
            await waitForNotPresence('jigsaw-tile');
            expectToExist('jigsaw-tile', false);
            buttons.get(1).click();
            await waitForPresence('jigsaw-tile');
            expectToExist('jigsaw-tile');
        });
        xit('shoud set combo select width', async () => {
            await browser.get('/combo-select/set-width');
            const inputs = $$('jigsaw-input'),
                comboSelect = $$('jigsaw-combo-select'),
            innerInput =element(by.id('input3'));
            let combo1Size = await comboSelect.get(0).getSize(),
                combo2Size = await comboSelect.get(1).getSize(),
                input3Size = await innerInput.getSize();
            inputs.get(0).sendKeys(100);
            expect(combo1Size.width).toBe(100+'px');
            mouseMove(comboSelect.get(1));
            await waitForPresence('input3');
            browser.sleep(1000);
            expect(combo1Size.width).toBe(400+'px');
            inputs.get(1).sendKeys(100);
            mouseMove(comboSelect.get(1));
            await waitForPresence('input3');
            browser.sleep(1000);
            expect(combo1Size.width).toBe(combo2Size.width);
        })
    })
});
