import { Component, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FilesService } from 'dipa-api-client';

@Component({
  selector: 'app-download-link',
  templateUrl: './download-link.component.html',
})
export class DownloadLinkComponent {
  @Input() public title: string;
  @Input() public fileId: number;

  public constructor(private filesService: FilesService) {}

  public onItemSelected(fileId: number): void {
    this.getDownloadFile(fileId);
  }

  public getDownloadFile(fileId: number): void {
    this.filesService.getFile(fileId, 'response').subscribe((response: HttpResponse<Blob>) => {
      let filename;

      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = fileNameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const dataType = 'arraybuffer';
      const binaryData = [response.body];
      // use a temporary link with document-attribute for naming file
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (filename) {
        downloadLink.setAttribute('download', filename);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  }
}
