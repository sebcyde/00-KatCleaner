const fs = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const csv = require('csv-parser');
const { parse } = require('csv-parse');

const userName = 'Sebastian Cyde';
const currentDate = new Date();
const day = String(currentDate.getUTCDate()).padStart(2, '0');
const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
const year = currentDate.getUTCFullYear();
const formattedDate = `${day}${month}${year}`;

const DirtyDirectory = 'C://Users/SebCy/Documents/Documents/Work/Katalon_Dirty';
const CleanDirectory = 'C://Users/SebCy/Documents/Documents/Work/Katalon_Clean';
const NewCleanDirectory = `${CleanDirectory}/${formattedDate}`;

const FileFisher = async (directoryPath) => {
	try {
		const files = await fs.readdir(directoryPath);

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const fileStats = await fs.stat(filePath);

			if (fileStats.isFile() && file.toLowerCase().endsWith('.csv')) {
				// Return the path of the PDF file
				let Company;
				if (filePath.toLowerCase().includes('electric')) {
					Company = 'Electric';
				} else if (filePath.toLowerCase().includes('red')) {
					Company = 'RedEngine';
				} else if (filePath.toLowerCase().includes('flight')) {
					Company = 'FlightClub';
				}

				return { Company, Path: filePath };
			} else if (fileStats.isDirectory()) {
				// Recursively traverse subdirectories
				const foundPath = await FileFisher(filePath);
				if (foundPath) {
					// Return the path if found in a subdirectory
					return foundPath;
				}
			}
		}

		// Return null if the PDF file was not found in this directory or its subdirectories
		return null;
	} catch (error) {
		console.error('Error in FileFisher:', error);
		return null;
	}
};

const PDFCopier = async (directoryPath) => {
	try {
		const files = await fs.readdir(directoryPath);

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const fileStats = await fs.stat(filePath);

			if (fileStats.isFile() && file.toLowerCase().endsWith('.pdf')) {
				return filePath;
			} else if (fileStats.isDirectory()) {
				// Recursively traverse subdirectories
				const foundPath = await PDFCopier(filePath);
				if (foundPath) {
					// Return the path if found in a subdirectory
					return foundPath;
				}
			}
		}

		return null;
	} catch (error) {
		console.error('Error in PDFCopier:', error);
		return null;
	}
};

const HTMLCopier = async (directoryPath) => {
	try {
		const files = await fs.readdir(directoryPath);

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const fileStats = await fs.stat(filePath);

			if (fileStats.isFile() && file.toLowerCase().endsWith('.html')) {
				return filePath;
			} else if (fileStats.isDirectory()) {
				// Recursively traverse subdirectories
				const foundPath = await HTMLCopier(filePath);
				if (foundPath) {
					// Return the path if found in a subdirectory
					return foundPath;
				}
			}
		}

		return null;
	} catch (error) {
		console.error('Error in HTMLCopier:', error);
		return null;
	}
};

const SubDirectoryCreator = async () => {
	const electricDirectory = `${NewCleanDirectory}/Electric`;
	const redEngineDirectory = `${NewCleanDirectory}/RedEngine`;
	const flightClubDirectory = `${NewCleanDirectory}/FlightClub`;

	try {
		await fs.access(electricDirectory);
		console.log('Electric directory already exists.');
	} catch (error) {
		await fs.mkdir(electricDirectory);
		console.log('Electric directory created.');
	}

	try {
		await fs.access(redEngineDirectory);
		console.log('RedEngine directory already exists.');
	} catch (error) {
		await fs.mkdir(redEngineDirectory);
		console.log('RedEngine directory created.');
	}

	try {
		await fs.access(flightClubDirectory);
		console.log('FlightClub directory already exists.');
	} catch (error) {
		await fs.mkdir(flightClubDirectory);
		console.log('FlightClub directory created.');
	}
	console.log('Created clean company subcontainers');
	console.log(' ');
};

const ExcelCreator = async (Path, Company) => {
	console.log(' ');
	console.log(`Excel Path: ${Path}`);
	console.log('Creating Excel Workbook');
	const workbook = new ExcelJS.Workbook();
	console.log('Created Excel Workbook');
	console.log('Adding Excel Worksheet');

	const worksheet = workbook.addWorksheet(`${Company}${formattedDate}`);
	console.log('Added Excel Worksheet', `${Company}${formattedDate}`);

	// Save the workbook to the specified output path
	await workbook.xlsx.writeFile(`${Path}/${Company}${formattedDate}.xlsk`);
	console.log(`Workbook saved to: ${Path}/${Company}${formattedDate}`);
	console.log(' ');
	return {
		Workbook: workbook,
		WorkSheet: worksheet,
		ExcelPath: `${Path}/${Company}${formattedDate}.xlsk`,
	};
};

const FileDataReader = async (filePath) => {
	try {
		console.log(' ');

		const Data = [];
		const input = await fs.readFile(filePath);
		await new Promise((resolve, reject) => {
			parse(
				input,
				{
					comment: '#',
				},
				function (err, records) {
					if (err) {
						reject(err);
					} else {
						records.forEach((record) => {
							Data.push(record);
						});
						resolve();
					}
				}
			);
		});
		return Data;
	} catch (error) {
		console.error('Error reading file:', error);
		return null;
	}
};

const DataTransfer = async (filePath, workbook, worksheet, excelPath) => {
	console.log('Starting data transfer');

	// Read the HTML file data
	const fileData = await FileDataReader(filePath);

	if (fileData) {
		// fileData.forEach((dataObject, i) => {
		// 	console.log(`CSV Record: ${i + 1}`, dataObject);
		// 	console.log(' ');
		// });

		console.log('Populating Excel Worksheet');

		fileData.forEach((dataObject, i) => {
			console.log(`Writing Record: ${i + 1}`);
			worksheet.getCell(`A${i + 3}`).value = dataObject[0];
			worksheet.getCell(`B${i + 3}`).value = dataObject[4];
			worksheet.getCell(`C${i + 3}`).value = dataObject[5];
			worksheet.getCell(`D${i + 3}`).value = dataObject[6];
			worksheet.getCell(`E${i + 3}`).value = dataObject[7];
		});

		// Signoff - user signatures etc
		console.log(' ');
		console.log('Signing Sheet');

		worksheet.getCell('A1').value = `Signed By: ${userName}`;
		worksheet.getCell('B1').value = `Creation Date: ${day}/${month}/${year}`;

		console.log(' ');
		console.log('Data transfer complete');
		console.log('Saving...');

		// Save the workbook to the specified output path
		await workbook.xlsx.writeFile(excelPath);
		console.log('Workbook saved to', excelPath);
	} else {
		console.error('Failed to read HTML data');
	}
};

fs.readdir(DirtyDirectory, { withFileTypes: true })
	.then(async (files) => {
		const DirtyDirectories = files
			.filter((file) => file.isDirectory())
			.map((file) => file.name);

		console.log('Dirty Directories:', DirtyDirectories);
		console.log('Creating clean container');
		try {
			await fs.access(NewCleanDirectory);
			console.log('Clean directory already exists.');
		} catch (error) {
			await fs.mkdir(NewCleanDirectory);
			console.log('Created clean container');
		}

		await SubDirectoryCreator();

		async function processDirectories() {
			for (const Dir of DirtyDirectories) {
				try {
					const FileDetails = await FileFisher(`${DirtyDirectory}/${Dir}`);
					const Company = FileDetails.Company;
					const FilePath = FileDetails.Path;

					const PDFPath = await PDFCopier(`${DirtyDirectory}/${Dir}`);
					const HTMLPath = await HTMLCopier(`${DirtyDirectory}/${Dir}`);

					console.log('Path:', FilePath);
					console.log('Company:', Company);

					console.log('Current Directory:', Dir);
					const directoryPath = `${NewCleanDirectory}/${Company}/${Dir}`;

					const NewPDFPath = `${directoryPath}/${Company}${formattedDate}.pdf`;
					const NewHTMLPath = `${directoryPath}/${Company}${formattedDate}.html`;

					try {
						await fs.access(directoryPath);
						console.log('Directory already exists.');
					} catch (error) {
						await fs.mkdir(directoryPath);
						console.log('Directory created successfully.');
					}

					await fs.copyFile(PDFPath, NewPDFPath);
					await fs.copyFile(HTMLPath, NewHTMLPath);

					const ExcelThings = await ExcelCreator(directoryPath, Company);
					await DataTransfer(
						FilePath,
						ExcelThings.Workbook,
						ExcelThings.WorkSheet,
						ExcelThings.ExcelPath
					);

					console.log(' ');
				} catch (error) {
					console.error('Error processing directory:', error);
				}
			}
		}

		processDirectories();
	})
	.catch((error) => {
		console.error('Error reading directory:', error);
	});
