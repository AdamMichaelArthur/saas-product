import{Pipe, PipeTransform} from'@angular/core';

@Pipe({name: 'checkBoxFilter'})
export class FabricTypePipe implements PipeTransform {

  ////For CheckBox With filture
  transform(demo_bounty: any, bounty_catogarys: any): any[] {
    if (!bounty_catogarys || bounty_catogarys.length === 0) return demo_bounty;
    return demo_bounty.filter(fabric => bounty_catogarys.includes(fabric.bounty_catogary));
  }
  ////For CheckBox With filture
}


@Pipe({
  name: 'grdFilter'
})
export class GrdFilterPipe implements PipeTransform {
  defaultFilter: boolean
  transform(items: any, filter: any): any[] {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);

      if (this.defaultFilter) {
        return items.filter(item =>
            filterKeys.reduce((x, keyName) =>
                (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
      }
      else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
          });
        });
      }
    }
  }
};


@Pipe({ 
  name: 'appFilter' 
})
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.toLocaleLowerCase().includes(searchText);
    });
  }
}

@Pipe({name: 'replaceUnderscore'})
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    return value? value.replace(/_/g, " ") : value;
  }
}


@Pipe({
    name: 'short'
})
export class ShortPipe {
  transform(val, args) {
    if (args === undefined) {
      return val;
    }

    console.log(val);

    if (val===undefined) {
      console.log("+undefined+");
      return val;
    }else{
      if (val.length > args) {
        console.log("No undefined");
        return val.substring(0, args) + ' ' + '......';
      } else {
        return val;
      }
    }
  }
}