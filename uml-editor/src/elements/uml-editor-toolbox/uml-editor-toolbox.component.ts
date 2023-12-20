import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, Output, QueryList, signal, ViewChildren } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { initCustomNamespaceGraph, initCustomPaper, jointJsCustomUmlItems } from '../../utils/jointjs-drawer.utils'
import { MatInputModule } from '@angular/material/input'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, map, startWith, Subject, takeUntil } from 'rxjs'
import { CustomElement } from '../../models/jointjs/custom-element.model'

@Component({
    selector: 'app-uml-editor-toolbox',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './uml-editor-toolbox.component.html',
    styleUrl: './uml-editor-toolbox.component.scss'
})
export class UmlEditorToolboxComponent implements AfterViewInit, OnDestroy {
    @Output() readonly itemSelected = new EventEmitter<string>()

    @ViewChildren('listItemsIcon') listItemsIcon!: QueryList<ElementRef<HTMLDivElement>>

    readonly searchControl = new FormControl<string>('')
    readonly items = signal<CustomElement[]>([])

    private readonly onDestroy = new Subject<void>()
    private readonly _toolboxItems = jointJsCustomUmlItems.filter(item => item.inToolbox).sort((a, b) => a.name.localeCompare(b.name))

    ngAfterViewInit() {
        // filter items by search input
        this.searchControl.valueChanges
            .pipe(
                takeUntil(this.onDestroy),
                startWith(this.searchControl.value),
                map((value) => value?.trim().toLowerCase() || ''),
                debounceTime(100)
            )
            .subscribe(this.filterItems)

        // draw list item graph
        this.listItemsIcon.changes.pipe(takeUntil(this.onDestroy)).subscribe((elements) => elements.forEach(this.drawListItemGraph))
    }

    selectItem(itemType: string) {
        this.itemSelected.emit(itemType)
    }

    ngOnDestroy() {
        this.onDestroy.next()
        this.onDestroy.complete()
    }

    private readonly filterItems = (search: string | null | undefined) => {
        const searchNormalized = search?.trim().toLowerCase()
        if (!searchNormalized) {
            return this.items.set(this._toolboxItems)
        }

        const filteredItems = this._toolboxItems.filter(item => item.name.toLowerCase().includes(searchNormalized))
        this.items.set(filteredItems)
    }

    private readonly drawListItemGraph = (listItemIconRef: ElementRef<HTMLDivElement>) => {
        const itemTypeAttributeValue = listItemIconRef.nativeElement.attributes.getNamedItem('data-item-type')?.value
        if (!itemTypeAttributeValue) {
            throw new Error('data-item-type attribute is missing')
        }

        const itemByType = jointJsCustomUmlItems.find(item => item.defaults.type === itemTypeAttributeValue)
        if (!itemByType) {
            throw new Error(`Item with type ${itemTypeAttributeValue} not found`)
        }

        const graph = initCustomNamespaceGraph()
        graph.addCell(itemByType.createEmpty())
        initCustomPaper(listItemIconRef.nativeElement, graph, false)
    }
}
