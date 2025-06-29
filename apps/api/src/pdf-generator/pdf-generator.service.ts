import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  // This method would dynamically insert resume data into an HTML template
  // For simplicity, this boilerplate just returns the content as is.
  // In a real app, you might use a templating engine like Handlebars or EJS here.
  renderTemplate(htmlContent: string, data: Record<string, any>): string {
    // Example: Replace placeholders like {{name}}, {{email}} with actual data
    let renderedHtml = htmlContent;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        renderedHtml = renderedHtml.replace(placeholder, data[key]);
      }
    }
    return renderedHtml;
  }

  async generatePdf(html: string): Promise<Buffer> {
    let browser: puppeteer.Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Set content directly, or navigate to a local file/server endpoint
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF with options
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      });

      this.logger.log('PDF generated successfully.');
      return pdfBuffer;
    } catch (error) {
      this.logger.error('Failed to generate PDF:', error.stack);
      throw new InternalServerErrorException('Failed to generate PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
