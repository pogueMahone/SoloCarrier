import { Component, OnInit, Inject, Injectable } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';


// tree
export class CatNode {
  children: CatNode[];
  item: string;
  include:boolean;  
  checked:boolean;
}

/** Flat to-do item node with expandable and level information */
export class CatFlatNode {
  item: string;
  level: number;
  expandable: boolean;  
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<CatNode[]>([]);

  get data(): CatNode[] { return this.dataChange.value; }

  constructor() {
    //this.initialize();
  }

  initialize(tree_data: any, selectedTag:string) {
    // Build the tree nodes from Json object. The result is a list of `CatNode` with nested
    //     file node as children.
    const data = this.buildFileTree(tree_data, 0, selectedTag);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `CatNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number,  selectedTag:string): CatNode[] {
    return Object.keys(obj).reduce<CatNode[]>((accumulator, key) => {
      const value = obj[key];    
      const node = new CatNode();
      node.item = key;     
      node.checked = (selectedTag && selectedTag === key);           
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1, selectedTag);
        } else {
          node.item = value;          
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  // insertItem(parent: CatNode, name: string) {
  //   if (parent.children) {
  //     parent.children.push({item: name} as CatNode);
  //     this.dataChange.next(this.data);
  //   }
  // }
   

  updateItem(node: CatNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

// component

@Component({
  selector: 'app-item-tag-dialog',
  templateUrl: './item-tag-dialog.component.html',
  styleUrls: ['./item-tag-dialog.component.scss'],
  providers: [ChecklistDatabase]
})
export class ItemTagDialogComponent implements OnInit {
  categories:any;
  tree_data:any;
  selected: CatFlatNode;
  flatNodeMap = new Map<CatFlatNode, CatNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CatNode, CatFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: CatFlatNode | null = null;
  /** The new item's name */
  newItemName = '';
  treeControl: FlatTreeControl<CatFlatNode>;
  treeFlattener: MatTreeFlattener<CatNode, CatFlatNode>;
  dataSource: MatTreeFlatDataSource<CatNode, CatFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<CatFlatNode>(true /* multiple */);
  tags:string[];
  constructor(private _database: ChecklistDatabase, private dialogRef: MatDialogRef<ItemTagDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialog_data: any) { 
    this.tags = dialog_data.tags;  
    const tag = this.tags && this.tags.length > 0 ? this.tags[this.tags.length -1] : null;   
    this.categories = dialog_data.categories;    
    this.tree_data = {};
    this.convertCategories(this.tree_data, this.categories);
    _database.initialize(this.tree_data, tag);
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CatFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);    
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;    
      if(this.selected){          
        this.expandBranch(this.selected);
        this.checklistSelection.select(this.selected);        
      }     
    });
  }

  private convertCategories(tree_data:any, categories: any){    
    for(let i=0; i< categories.length; i++ ){      
      if(categories[i].subs){
        tree_data[categories[i].name] = {};
        this.convertCategories(tree_data[categories[i].name], categories[i].subs);
      } else{
        tree_data[categories[i].name] = null;
      }
    }    
  }

  ngOnInit(): void {
  }

  private expandBranch(node:CatFlatNode){    
    this.treeControl.expand(node); 
    let parent: CatFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.treeControl.expand(parent);
      parent = this.getParentNode(parent);
    }
  }

  save(){   
    if(this.tags){
      this.tags.length = 0;
    } else{
      this.tags = new Array<string>();
    }    
   this.tags.push(this.checklistSelection.selected[0].item); 
    let parent: CatFlatNode | null = this.getParentNode(this.checklistSelection.selected[0]);
    this.tags.push(parent.item); 
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
      if(parent){
        this.tags.push(parent.item);
      }
    }
    this.tags.reverse();
  //   const p = this.getParentNode(this.checklistSelection.selected[0]);
  //  const descendants = this.treeControl.getDescendants(p);   
  //  this.tags.length = 0;
  //  this.tags.push(p.item);
  //  descendants.forEach(node => {
  //     this.tags.push(node.item);
  //  });
  this.dialogRef.close(this.tags);
  }

  cancel() {   
    this.dialogRef.close(null);
  }  

  getLevel = (node: CatFlatNode) => node.level;

  isExpandable = (node: CatFlatNode) => node.expandable;

  getChildren = (node: CatNode): CatNode[] => node.children;

  hasChild = (_: number, _nodeData: CatFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CatFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CatNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new CatFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    if(node.checked){      
      this.selected = flatNode;        
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  clear(){    
    this.checklistSelection.clear();
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CatFlatNode): boolean {    
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CatFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  selectionToggle(node: CatFlatNode): void {   
    this.checklistSelection.toggle(node);
    //const descendants = this.treeControl.getDescendants(node);
    // this.checklistSelection.isSelected(node)
    //   ? this.checklistSelection.select(...descendants)
    //   : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    // descendants.every(child =>
    //   this.checklistSelection.isSelected(child)
    // );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: CatFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CatFlatNode): void {
    let parent: CatFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CatFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: CatFlatNode): CatFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  // addNewItem(node: CatFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  /** Save the node to database */
  saveNode(node: CatFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }

}


