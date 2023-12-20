import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { initCustomNamespaceGraph, initCustomPaper, jointJsCustomUMLItemsInstance } from '../../utils/jointjs-drawer.utils'

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
    readonly items: { type: string, name: string }[] = Object.keys(jointJsCustomUMLItemsInstance).map((type) => ({ type, name: type.split('.').slice(-1)[0] }))

    @Output() readonly itemSelected = new EventEmitter<string>()

    @ViewChildren('listItemsIcon') listItemsIcon?: QueryList<ElementRef<HTMLDivElement>>

    ngAfterViewInit() {
        this.listItemsIcon?.forEach((listItemIcon, index) => {
            const graph = initCustomNamespaceGraph()
            graph.addCell(Object.values(jointJsCustomUMLItemsInstance)[index].clone())
            initCustomPaper(listItemIcon.nativeElement, graph, false)
        })
    }

    selectItem(itemType: string) {
        this.itemSelected.emit(itemType)
    }
}
