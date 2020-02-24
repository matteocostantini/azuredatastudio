/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModelViewBase } from './modelViewBase';
import { ApiWrapper } from '../../common/apiWrapper';
import { ModelSourcesComponent, ModelSourceType } from './modelSourcesComponent';
import { LocalModelsComponent } from './localModelsComponent';
import { AzureModelsComponent } from './azureModelsComponent';
import * as constants from '../../common/constants';
import { WizardView } from '../wizardView';

/**
 * Wizard to register a model
 */
export class RegisterModelWizard extends ModelViewBase {

	public modelResources: ModelSourcesComponent | undefined;
	public localModelsComponent: LocalModelsComponent | undefined;
	public azureModelsComponent: AzureModelsComponent | undefined;
	public wizardView: WizardView | undefined;

	constructor(
		apiWrapper: ApiWrapper,
		root: string,
		parent?: ModelViewBase) {
		super(apiWrapper, root, parent);
	}

	/**
	 * Opens a dialog to manage packages used by notebooks.
	 */
	public open(): void {

		this.modelResources = new ModelSourcesComponent(this._apiWrapper, this);
		this.localModelsComponent = new LocalModelsComponent(this._apiWrapper, this);
		this.azureModelsComponent = new AzureModelsComponent(this._apiWrapper, this);

		this.wizardView = new WizardView(this._apiWrapper);

		let wizard = this.wizardView.createWizard(constants.registerModelWizardTitle, [this.modelResources, this.localModelsComponent]);
		this.mainViewPanel = this.parent?.mainViewPanel || wizard;
		wizard.doneButton.label = constants.azureRegisterModel;
		wizard.generateScriptButton.hidden = true;
		wizard.doneButton.onClick(async () => {
			try {
				if (this.modelResources && this.localModelsComponent && this.modelResources.data) {
					await this.registerLocalModel(this.localModelsComponent.data);
				} else {
					await this.registerAzureModel(this.azureModelsComponent?.data);
				}
				this.showInfoMessage(constants.modelRegisteredSuccessfully);
			} catch (error) {
				this.showErrorMessage(`${constants.modelFailedToRegister} ${constants.getErrorMessage(error)}`);
			}
			if (this.parent) {
				this.parent.refresh();
			}
		});

		wizard.registerNavigationValidator(() => {
			return true;
		});

		wizard.open();
	}

	private loadPages(): void {
		if (this.modelResources && this.localModelsComponent && this.modelResources.data === ModelSourceType.Local) {
			this.wizardView?.addWizardPage(this.localModelsComponent, 1);

		} else if (this.azureModelsComponent) {
			this.wizardView?.addWizardPage(this.azureModelsComponent, 1);
		}
	}

	/**
	 * Refresh the pages
	 */
	public async refresh(): Promise<void> {
		this.loadPages();
		this.wizardView?.refresh();
	}
}
