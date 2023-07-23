import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { json2csv } from 'json-2-csv';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'result',
  standalone: true,
  template: `
    <div
      class="w-full max-w-[480px] px-[16px] bg-primary  justify-center mx-auto h-screen flex flex-col  "
    >
      <!-- [href]="downloadUrl" -->
      <a
        class="hidden"
        [href]="downloadUrl"
        download="results.csv"
        #downloadAnchor
      ></a>

      <button
        class="btn btn-secondary w-full btn-md "
        (click)="handleDownloadClick(downloadAnchor)"
      >
        Download
      </button>
    </div>
  `,
})
export default class ResultComponent implements OnInit {
  downloadUrl = '';
  finishedLoading = false;

  async handleDownloadClick(anchorElem: HTMLAnchorElement) {
    if (!this.finishedLoading) throw new Error('download url not prepared yet');

    anchorElem.click();
  }

  constructor(private supabaseService: SupabaseService) {
    this.prepareDownloadLink();
  }

  async prepareDownloadLink() {
    const data = await this.getData();
    const csv = await json2csv(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    this.downloadUrl = url;
    this.finishedLoading = true;
  }

  ngOnInit(): void {
    // this.prepareDownloadLink();
  }

  private async getResults() {
    const resultRequest = await this.supabaseService.client
      .from('result')
      .select('*');

    if (resultRequest.error !== null) throw new Error('error getting results');

    const results = resultRequest.data;

    return results;
  }

  private async getCategoryScores() {
    const categoryRequest = await this.supabaseService.client
      .from('category')
      .select('*');

    if (categoryRequest.error !== null)
      throw new Error('error getting results');

    const categories = categoryRequest.data;

    return categories;
  }

  private combineData(
    results: {
      id: number;
      name: string;
      post_test: number;
      pre_test: number;
      school: string;
    }[],
    categories: {
      id: number;
      name: string;
      result_id: number;
      score: number;
    }[],
  ) {
    const combinedData = results.map((r) => {
      const combined: {
        id: number;
        name: string;
        post_test: number;
        pre_test: number;
        school: string;
        categories: { [key: string]: number };
      } = { ...r, categories: {} };

      categories.forEach((c) => {
        if (c.result_id === r.id) {
          combined.categories[c.name] = c.score;
        }
      });

      return combined;
    });

    return combinedData;
  }

  async getData() {
    const results = await this.getResults();
    const categories = await this.getCategoryScores();
    const combinedData = this.combineData(results, categories);

    return combinedData;
  }
}
