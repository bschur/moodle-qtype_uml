import { NgForOf } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { debounceTime, map, startWith } from 'rxjs'
import { CustomJointJSElement } from '../../models/jointjs/custom-jointjs-element.model'
import { initCustomNamespaceGraph, initCustomPaper } from '../../utils/jointjs-drawer.utils'
import { jointJSCustomUmlElements } from '../../utils/jointjs-extension.const'

@Component({
  selector: 'uml-editor-toolbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, MatListModule, MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './uml-editor-toolbox.component.html',
  styleUrl: './uml-editor-toolbox.component.scss',
})
export class UmlEditorToolboxComponent implements AfterViewInit {
  @Output() readonly itemSelected = new EventEmitter<string>()

  @ViewChildren('listItemsIcon') listItemsIcon!: QueryList<ElementRef<HTMLDivElement>>

  readonly searchControl = new FormControl<string>('')
  readonly items = signal<CustomJointJSElement[]>([])

  private readonly destroyRef = inject(DestroyRef)

  private readonly _toolboxItems = jointJSCustomUmlElements
    .filter(item => item.inToolbox)
    .sort((a, b) => a.name.localeCompare(b.name))

  constructor() {
    // filter items by search input
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        startWith(this.searchControl.value),
        map(value => value?.trim().toLowerCase() || ''),
        debounceTime(200)
      )
      .subscribe(this.filterItems)
  }

  ngAfterViewInit() {
    // draw list item graph
    this.listItemsIcon.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(elements => elements.forEach(this.drawListItemGraph))
  }

  selectItem(itemType: string) {
    this.itemSelected.emit(itemType)
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

    const itemByType = jointJSCustomUmlElements.find(item => item.defaults.type === itemTypeAttributeValue)
    if (!itemByType) {
      throw new Error(`Item with type ${itemTypeAttributeValue} not found`)
    }

    const graph = initCustomNamespaceGraph()
    graph.addCell(itemByType.instance.clone())
    initCustomPaper(listItemIconRef.nativeElement, graph, {
      interactive: false,
    })
  }
}
