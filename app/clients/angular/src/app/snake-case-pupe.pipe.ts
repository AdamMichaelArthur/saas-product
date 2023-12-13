import { Pipe, PipeTransform } from '@angular/core';
import Voca from 'voca'

@Pipe({
  name: 'snakeCasePupe'
})
export class SnakeCasePupePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return Voca.titleCase(Voca.replaceAll(Voca.kebabCase(value), "-", " "));;
  }

}
