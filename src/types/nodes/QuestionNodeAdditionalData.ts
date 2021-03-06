import BaseNodeAdditionalData from '../BaseNodeAdditionalData';
import NodeDataWithVariableName from '../NodeDataWithVariableName';
import { QuestionChoiceType } from './QuestionChoiceType';

/**
 * Variable used as a question's choice.
 */
export type QuestionChoiceVariable = {
  /**
   * Id of the variable.
   * Used for react indexing ("key").
   */
  id: string;

  /**
   * Timestamp of creation. (should use lodash.now())
   */
  createdAt: string;

  /**
   * Name of the variable.
   */
  name?: string;

  /**
   * Value of the variable.
   * String is the expected type (because text input), but it could also represent a number.
   *
   * TODO handle i18n
   */
  value?: string;
}

/**
 * Additional "node.data" for the "QuestionNodeData" type.
 */
export type QuestionNodeAdditionalData = BaseNodeAdditionalData & NodeDataWithVariableName & {
  /**
   * Question asked to the user (as text).
   */
  questionText?: string;

  /**
   * Type of the question
   */
  questionChoiceType?: QuestionChoiceType;

  /**
   * Question choices.
   *
   * Used when questionChoiceType is 'single-quick-reply'.
   */
  questionChoices?: QuestionChoiceVariable[];
};
