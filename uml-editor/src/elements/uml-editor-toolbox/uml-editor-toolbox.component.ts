import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { initCustomNamespaceGraph, initCustomPaper, jointJsCustomUmlItems } from '../../utils/jointjs-drawer.utils'

@Component({
    selector: 'app-uml-editor-toolbox',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatListModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './uml-editor-toolbox.component.html',
    styleUrl: './uml-editor-toolbox.component.scss'
})
export class UmlEditorToolboxComponent implements AfterViewInit {
    readonly items = jointJsCustomUmlItems.filter(item => item.inToolbox)

    @Output() readonly itemSelected = new EventEmitter<string>()

    @ViewChildren('listItemsIcon') listItemsIcon?: QueryList<ElementRef<HTMLDivElement>>

    ngAfterViewInit() {
        this.listItemsIcon?.forEach((listItemIcon, index) => {
            const itemTypeAttributeValue = listItemIcon.nativeElement.attributes.getNamedItem('data-item-type')?.value
            if (!itemTypeAttributeValue) {
                throw new Error('data-item-type attribute is missing')
            }

            const itemByType = jointJsCustomUmlItems.find(item => item.defaults.type === itemTypeAttributeValue)
            if (!itemByType) {
                throw new Error(`Item with type ${itemTypeAttributeValue} not found`)
            }

            const graph = initCustomNamespaceGraph()
            graph.addCell(itemByType.createEmpty())
            initCustomPaper(listItemIcon.nativeElement, graph, false)
        })
    }

    selectItem(itemType: string) {
        this.itemSelected.emit(itemType)
    }
}
