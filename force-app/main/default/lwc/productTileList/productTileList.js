import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class ProductTileList extends LightningElement {
    @api searchBarIsVisible = false;
    @api tilesAreDraggable = false;
    @track products = [];
    @track pageNumber = 1;
    @track pageSize;
    @track totalItemCount = 0;
    filters = '{}';

    @wire(CurrentPageReference) pageRef;

    @wire(getProducts, [])
    products;

    connectedCallback() {
        registerListener('filterChange', this.handleFilterChange, this);
    }

    handleProductSelected(event) {
        fireEvent(this.pageRef, 'productSelected', event.detail);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleSearchKeyChange(event) {
        const searchKey = event.target.value.toLowerCase();
        this.handleFilterChange({ searchKey });
    }

    handleFilterChange(filters) {
        this.filters = JSON.stringify(filters);
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}
